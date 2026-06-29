import {
  Activity,
  AlertTriangle,
  Blocks,
  BookOpen,
  Bot,
  CheckCircle2,
  CircleDot,
  FileText,
  GitBranch,
  Image,
  Layers3,
  Route,
  Search,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  fetchEvidenceGraph,
  fetchGraphicalAbstract,
  fetchReviewIssues,
  fetchRoadmap,
  fetchRun
} from "../api";
import type {
  AgentCard,
  Artifact,
  EvidenceGraph,
  GraphicalAbstract,
  ReviewIssue,
  RoadmapNode,
  RunPayload,
  WorkflowEvent,
  WorkflowState
} from "../types";

const ACTIVE_RUN_ID = "run_20260629_001";

const workflowStates: WorkflowState[] = [
  "INTAKE",
  "PROTOCOL_PLANNING",
  "TECHNICAL_ROADMAP_DESIGN",
  "LITERATURE_SEARCH",
  "EVIDENCE_EXTRACTION",
  "CLAIM_SYNTHESIS",
  "DATA_ANALYSIS",
  "FIGURE_PLANNING",
  "GRAPHICAL_ABSTRACT_GENERATION",
  "MANUSCRIPT_OUTLINE",
  "SECTION_DRAFTING",
  "INTERNAL_REVIEW",
  "REVISION",
  "READY_FOR_HUMAN"
];

type View = "run" | "artifacts" | "evidence" | "roadmap" | "figures" | "review";

export function App() {
  const [runPayload, setRunPayload] = useState<RunPayload | null>(null);
  const [evidenceGraph, setEvidenceGraph] = useState<EvidenceGraph | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapNode[]>([]);
  const [graphicalAbstract, setGraphicalAbstract] = useState<GraphicalAbstract | null>(null);
  const [reviewIssues, setReviewIssues] = useState<ReviewIssue[]>([]);
  const [view, setView] = useState<View>("run");
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [liveEvents, setLiveEvents] = useState<WorkflowEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchRun(ACTIVE_RUN_ID),
      fetchEvidenceGraph(),
      fetchRoadmap(),
      fetchGraphicalAbstract(),
      fetchReviewIssues()
    ])
      .then(([runData, graphData, roadmapData, abstractData, reviewData]) => {
        setRunPayload(runData);
        setEvidenceGraph(graphData);
        setRoadmap(roadmapData.nodes);
        setGraphicalAbstract(abstractData);
        setReviewIssues(reviewData.issues);
        setSelectedArtifact(runData.artifacts[0] ?? null);
        setLiveEvents(runData.events);
      })
      .catch((requestError: Error) => setError(requestError.message));
  }, []);

  useEffect(() => {
    const source = new EventSource(`/api/runs/${ACTIVE_RUN_ID}/events`);
    const append = (event: MessageEvent) => {
      const parsed = JSON.parse(event.data) as WorkflowEvent;
      if (!parsed.id) return;
      setLiveEvents((items) => {
        if (items.some((item) => item.id === parsed.id)) return items;
        return [parsed, ...items].slice(0, 12);
      });
    };
    source.addEventListener("workflow.state_changed", append);
    source.addEventListener("agent.artifact_created", append);
    source.addEventListener("claim.validated", append);
    source.addEventListener("agent.blocked", append);
    return () => source.close();
  }, []);

  const activeBlockers = useMemo(
    () => runPayload?.agents.flatMap((agent) => agent.blockers.map((blocker) => ({ agent, blocker }))) ?? [],
    [runPayload]
  );

  if (error) {
    return <main className="errorState">API error: {error}</main>;
  }

  if (!runPayload || !evidenceGraph || !graphicalAbstract) {
    return <main className="loadingState">Loading Paperman workbench...</main>;
  }

  return (
    <main className="appShell">
      <header className="topbar">
        <div>
          <div className="eyebrow">Scientific Agent Workbench</div>
          <h1>{runPayload.project.title}</h1>
          <p>{runPayload.project.question}</p>
        </div>
        <div className="runSummary">
          <span className={`statusPill ${runPayload.run.status}`}>{runPayload.run.status}</span>
          <span>{runPayload.run.state}</span>
          <strong>{runPayload.run.progress}%</strong>
        </div>
      </header>

      <nav className="tabs" aria-label="Workbench views">
        <TabButton active={view === "run"} onClick={() => setView("run")} icon={<Activity size={18} />} label="Run View" />
        <TabButton active={view === "artifacts"} onClick={() => setView("artifacts")} icon={<FileText size={18} />} label="Artifacts" />
        <TabButton active={view === "evidence"} onClick={() => setView("evidence")} icon={<GitBranch size={18} />} label="Evidence Graph" />
        <TabButton active={view === "roadmap"} onClick={() => setView("roadmap")} icon={<Route size={18} />} label="Roadmap" />
        <TabButton active={view === "figures"} onClick={() => setView("figures")} icon={<Image size={18} />} label="Figure Studio" />
        <TabButton active={view === "review"} onClick={() => setView("review")} icon={<ShieldAlert size={18} />} label="Review" />
      </nav>

      {view === "run" && (
        <section className="runGrid">
          <WorkflowPanel currentState={runPayload.run.state} />
          <AgentLanes agents={runPayload.agents} />
          <aside className="sideStack">
            <Blockers blockers={activeBlockers} />
            <ArtifactList
              artifacts={runPayload.artifacts}
              selectedArtifact={selectedArtifact}
              onSelect={setSelectedArtifact}
            />
          </aside>
          <PreviewPanel artifact={selectedArtifact} events={liveEvents} />
        </section>
      )}

      {view === "artifacts" && (
        <section className="twoColumn">
          <ArtifactList artifacts={runPayload.artifacts} selectedArtifact={selectedArtifact} onSelect={setSelectedArtifact} />
          <ArtifactDetail artifact={selectedArtifact} />
        </section>
      )}

      {view === "evidence" && <EvidenceGraphView graph={evidenceGraph} />}
      {view === "roadmap" && <RoadmapView nodes={roadmap} />}
      {view === "figures" && <FigureStudio data={graphicalAbstract} />}
      {view === "review" && <ReviewView issues={reviewIssues} artifacts={runPayload.artifacts} />}
    </main>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className={`tabButton ${active ? "active" : ""}`} onClick={onClick} type="button">
      {icon}
      <span>{label}</span>
    </button>
  );
}

function WorkflowPanel({ currentState }: { currentState: WorkflowState }) {
  const currentIndex = workflowStates.indexOf(currentState);
  return (
    <section className="panel workflowPanel">
      <div className="panelHeader">
        <Layers3 size={18} />
        <h2>Workflow</h2>
      </div>
      <div className="workflowList">
        {workflowStates.map((state, index) => (
          <div
            className={`workflowStep ${index < currentIndex ? "done" : ""} ${state === currentState ? "current" : ""}`}
            key={state}
          >
            {index < currentIndex ? <CheckCircle2 size={15} /> : <CircleDot size={15} />}
            <span>{state.replaceAll("_", " ")}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AgentLanes({ agents }: { agents: AgentCard[] }) {
  return (
    <section className="panel agentPanel">
      <div className="panelHeader">
        <Bot size={18} />
        <h2>Agent Lanes</h2>
      </div>
      <div className="agentGrid">
        {agents.map((agent) => (
          <article className={`agentCard ${agent.status}`} key={agent.id}>
            <div className="agentTopline">
              <h3>{agent.name}</h3>
              <span>{agent.status}</span>
            </div>
            <p className="agentRole">{agent.role}</p>
            <p className="agentAction">{agent.currentAction}</p>
            <div className="tagRow">
              {agent.toolsUsed.slice(0, 3).map((tool) => (
                <span className="tag" key={tool}>
                  {tool}
                </span>
              ))}
            </div>
            {agent.blockers.length > 0 && (
              <div className="inlineAlert">
                <AlertTriangle size={15} />
                {agent.blockers[0]}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function Blockers({ blockers }: { blockers: { agent: AgentCard; blocker: string }[] }) {
  return (
    <section className="panel">
      <div className="panelHeader">
        <AlertTriangle size={18} />
        <h2>Blockers</h2>
      </div>
      {blockers.length === 0 ? (
        <p className="muted">No active blockers.</p>
      ) : (
        <div className="blockerList">
          {blockers.map(({ agent, blocker }) => (
            <div className="blocker" key={`${agent.id}-${blocker}`}>
              <strong>{agent.name}</strong>
              <span>{blocker}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ArtifactList({
  artifacts,
  selectedArtifact,
  onSelect
}: {
  artifacts: Artifact[];
  selectedArtifact: Artifact | null;
  onSelect: (artifact: Artifact) => void;
}) {
  return (
    <section className="panel artifactPanel">
      <div className="panelHeader">
        <FileText size={18} />
        <h2>Artifacts</h2>
      </div>
      <div className="artifactList">
        {artifacts.map((artifact) => (
          <button
            className={`artifactItem ${selectedArtifact?.id === artifact.id ? "selected" : ""}`}
            key={artifact.id}
            onClick={() => onSelect(artifact)}
            type="button"
          >
            <span>{artifact.title}</span>
            <small>
              v{artifact.version} · {artifact.status}
            </small>
          </button>
        ))}
      </div>
    </section>
  );
}

function PreviewPanel({ artifact, events }: { artifact: Artifact | null; events: WorkflowEvent[] }) {
  return (
    <section className="panel previewPanel">
      <div className="previewContent">
        <ArtifactDetail artifact={artifact} />
      </div>
      <div className="eventStream">
        <div className="panelHeader compact">
          <Activity size={17} />
          <h2>Event Stream</h2>
        </div>
        {events.map((event) => (
          <div className="eventRow" key={event.id}>
            <span>{event.event}</span>
            <p>{event.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArtifactDetail({ artifact }: { artifact: Artifact | null }) {
  if (!artifact) {
    return <p className="muted">Select an artifact to inspect provenance and preview.</p>;
  }
  return (
    <section className="artifactDetail">
      <div className="detailHeader">
        <div>
          <h2>{artifact.title}</h2>
          <p>{artifact.path}</p>
        </div>
        <span className={`statusPill ${artifact.status}`}>{artifact.status}</span>
      </div>
      <p className="detailPreview">{artifact.preview}</p>
      <div className="metaGrid">
        <Meta label="Producer" value={artifact.producerAgent} />
        <Meta label="Version" value={`v${artifact.version}`} />
        <Meta label="Type" value={artifact.type} />
        <Meta label="Hash" value={artifact.contentHash} />
      </div>
      <div className="inputBlock">
        <strong>Input artifacts</strong>
        <span>{artifact.inputArtifacts.length ? artifact.inputArtifacts.join(", ") : "none"}</span>
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="metaItem">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EvidenceGraphView({ graph }: { graph: EvidenceGraph }) {
  const groups = ["paper", "evidence", "claim", "roadmap", "figure", "manuscript"] as const;
  return (
    <section className="panel widePanel">
      <div className="panelHeader">
        <GitBranch size={18} />
        <h2>Evidence Graph</h2>
      </div>
      <div className="graphGrid">
        {groups.map((group) => (
          <div className="graphColumn" key={group}>
            <h3>{group}</h3>
            {graph.nodes
              .filter((node) => node.group === group)
              .map((node) => (
                <div className={`graphNode ${node.status}`} key={node.id}>
                  <span>{node.label}</span>
                  <small>{node.status}</small>
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="edgeList">
        {graph.edges.map((edge) => (
          <div className="edgeRow" key={`${edge.source}-${edge.target}`}>
            <span>{edge.source}</span>
            <strong>{edge.label}</strong>
            <span>{edge.target}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RoadmapView({ nodes }: { nodes: RoadmapNode[] }) {
  return (
    <section className="panel widePanel">
      <div className="panelHeader">
        <Route size={18} />
        <h2>Technical Roadmap</h2>
      </div>
      <div className="roadmapFlow">
        {nodes.map((node, index) => (
          <article className={`roadmapNode ${node.evidenceStatus}`} key={node.id}>
            <div className="nodeIndex">{index + 1}</div>
            <h3>{node.title}</h3>
            <p>{node.stage.replaceAll("_", " ")}</p>
            <div className="miniGrid">
              <div>
                <strong>Inputs</strong>
                {node.inputs.slice(0, 2).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div>
                <strong>Outputs</strong>
                {node.outputs.slice(0, 2).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className="riskLine">
              <AlertTriangle size={14} />
              {node.risks[0]}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FigureStudio({ data }: { data: GraphicalAbstract }) {
  return (
    <section className="figureStudio">
      <div className="panel visualStory">
        <div className="panelHeader">
          <Sparkles size={18} />
          <h2>Graphical Abstract Studio</h2>
        </div>
        <h3>{data.title}</h3>
        <p>{data.message}</p>
        <div className="gaCanvas">
          {data.elements.map((element) => (
            <article className={`gaPanel ${element.reviewStatus}`} key={element.id}>
              <span>{element.panel}</span>
              <h4>{element.label}</h4>
              <p>{element.visualDescription}</p>
              <small>Risk: {element.overclaimRisk}</small>
            </article>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="panelHeader">
          <BookOpen size={18} />
          <h2>Prompt, Caption, Evidence</h2>
        </div>
        <div className="promptBox">{data.prompt}</div>
        <h3>Caption</h3>
        <p>{data.caption}</p>
        <h3>Alt text</h3>
        <p>{data.altText}</p>
        <div className="elementList">
          {data.elements.map((element) => (
            <div className="elementRow" key={element.id}>
              <strong>{element.label}</strong>
              <span>
                Claims: {[...element.linkedClaims, ...element.linkedHypotheses].join(", ") || "none"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewView({ issues, artifacts }: { issues: ReviewIssue[]; artifacts: Artifact[] }) {
  return (
    <section className="panel widePanel">
      <div className="panelHeader">
        <Search size={18} />
        <h2>Internal Review</h2>
      </div>
      <div className="issueList">
        {issues.map((issue) => {
          const artifact = artifacts.find((item) => item.id === issue.targetArtifactId);
          return (
            <article className={`issueCard ${issue.severity}`} key={issue.id}>
              <div>
                <span className="severity">{issue.severity}</span>
                <h3>{issue.title}</h3>
                <p>{issue.detail}</p>
                <small>Target: {artifact?.title ?? issue.targetArtifactId}</small>
              </div>
              <span className={`statusPill ${issue.status}`}>{issue.status}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
