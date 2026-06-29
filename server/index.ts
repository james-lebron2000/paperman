import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import {
  agents,
  artifacts,
  claims,
  events,
  evidenceGraph,
  graphicalAbstract,
  projects,
  reviewIssues,
  roadmap,
  runs,
  workflowStates
} from "./store";
import type { WorkflowState } from "./contracts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT ?? 5173);

const app = express();
app.use(cors());
app.use(express.json());

function isWorkflowState(value: unknown): value is WorkflowState {
  return typeof value === "string" && workflowStates.includes(value as WorkflowState);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "paperman", version: "0.1.0" });
});

app.get("/api/projects", (_req, res) => {
  res.json({ projects });
});

app.post("/api/projects", (req, res) => {
  const title = String(req.body?.title ?? "Untitled research project");
  const question = String(req.body?.question ?? "Define research question");
  const id = `project_${Date.now()}`;
  const runId = `run_${Date.now()}`;
  const updatedAt = new Date().toISOString();
  const project = {
    id,
    title,
    question,
    domain: String(req.body?.domain ?? "biomedical research"),
    targetJournalStyle: String(req.body?.targetJournalStyle ?? "Nature-style biomedical article"),
    activeRunId: runId,
    updatedAt
  };
  projects.push(project);
  runs.push({
    id: runId,
    projectId: id,
    state: "INTAKE",
    status: "running",
    startedAt: updatedAt,
    updatedAt,
    progress: 3
  });
  res.status(201).json({ project, runId });
});

app.get("/api/projects/:projectId", (req, res) => {
  const project = projects.find((item) => item.id === req.params.projectId);
  if (!project) {
    res.status(404).json({ error: "project_not_found" });
    return;
  }
  res.json({ project });
});

app.get("/api/runs/:runId", (req, res) => {
  const run = runs.find((item) => item.id === req.params.runId);
  if (!run) {
    res.status(404).json({ error: "run_not_found" });
    return;
  }
  const project = projects.find((item) => item.id === run.projectId);
  res.json({
    project,
    run,
    agents,
    artifacts: artifacts.filter((item) => item.runId === run.id),
    events: events.filter((item) => item.runId === run.id)
  });
});

app.post("/api/runs/:runId/advance", (req, res) => {
  const run = runs.find((item) => item.id === req.params.runId);
  if (!run) {
    res.status(404).json({ error: "run_not_found" });
    return;
  }
  const requestedState = req.body?.state;
  const currentIndex = workflowStates.indexOf(run.state);
  const nextState =
    isWorkflowState(requestedState)
      ? requestedState
      : workflowStates[Math.min(currentIndex + 1, workflowStates.length - 1)];
  run.state = nextState;
  run.status = nextState === "READY_FOR_HUMAN" ? "completed" : "running";
  run.progress = Math.round(((workflowStates.indexOf(nextState) + 1) / workflowStates.length) * 100);
  run.updatedAt = new Date().toISOString();
  const event = {
    id: `evt_${Date.now()}`,
    event: "workflow.state_changed",
    runId: run.id,
    state: nextState,
    detail: `Workflow advanced to ${nextState}.`,
    timestamp: run.updatedAt
  };
  events.push(event);
  res.json({ run, event });
});

app.get("/api/runs/:runId/events", (req, res) => {
  const run = runs.find((item) => item.id === req.params.runId);
  if (!run) {
    res.status(404).json({ error: "run_not_found" });
    return;
  }
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });
  for (const event of events.filter((item) => item.runId === run.id)) {
    res.write(`event: ${event.event}\n`);
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }
  const interval = setInterval(() => {
    res.write("event: heartbeat\n");
    res.write(
      `data: ${JSON.stringify({
        event: "heartbeat",
        runId: run.id,
        state: run.state,
        timestamp: new Date().toISOString()
      })}\n\n`
    );
  }, 5000);
  req.on("close", () => clearInterval(interval));
});

app.get("/api/artifacts", (req, res) => {
  const projectId = String(req.query.projectId ?? "");
  res.json({ artifacts: projectId ? artifacts.filter((item) => item.projectId === projectId) : artifacts });
});

app.get("/api/claims", (_req, res) => {
  res.json({ claims });
});

app.get("/api/evidence-graph", (_req, res) => {
  res.json(evidenceGraph);
});

app.get("/api/roadmap", (_req, res) => {
  res.json({ nodes: roadmap });
});

app.get("/api/graphical-abstract", (_req, res) => {
  res.json(graphicalAbstract);
});

app.get("/api/review", (_req, res) => {
  res.json({ issues: reviewIssues });
});

if (isProduction) {
  app.use(express.static(path.join(root, "dist/client")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(root, "dist/client/index.html"));
  });
} else {
  const vite = await createViteServer({
    root,
    server: { middlewareMode: true },
    appType: "spa"
  });
  app.use(vite.middlewares);
}

app.listen(port, () => {
  console.log(`Paperman workbench running at http://localhost:${port}`);
});
