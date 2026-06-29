# Paperman API

Base URL during local development:

```text
http://localhost:5173
```

All endpoints return JSON unless noted.

## Health

```http
GET /api/health
```

Response:

```json
{
  "ok": true,
  "service": "paperman",
  "version": "0.1.0"
}
```

## Projects

```http
GET /api/projects
```

Returns the project list.

```http
POST /api/projects
Content-Type: application/json
```

Request:

```json
{
  "title": "AH enhances PD-1 response in colorectal cancer",
  "question": "Why does AH enhance PD-1 efficacy?",
  "domain": "translational colorectal cancer immunotherapy",
  "targetJournalStyle": "Nature-style biomedical article"
}
```

Creates a project and an initial run.

```http
GET /api/projects/:projectId
```

Returns one project.

## Workflow Runs

```http
GET /api/runs/:runId
```

Returns one complete run payload:

```json
{
  "project": {},
  "run": {},
  "agents": [],
  "artifacts": [],
  "events": []
}
```

```http
POST /api/runs/:runId/advance
Content-Type: application/json
```

Request:

```json
{
  "state": "INTERNAL_REVIEW"
}
```

If `state` is omitted, the run advances to the next state in the finite state machine.

## Event Stream

```http
GET /api/runs/:runId/events
Accept: text/event-stream
```

Server-sent event stream. Existing run events are replayed first, followed by heartbeat events.

Implemented event names:

```text
workflow.state_changed
agent.artifact_created
claim.validated
agent.blocked
heartbeat
```

Event data shape:

```json
{
  "id": "evt_004",
  "event": "agent.blocked",
  "runId": "run_20260629_001",
  "agent": "GraphicalAbstractAgent",
  "state": "GRAPHICAL_ABSTRACT_GENERATION",
  "detail": "Blocked by missing validated metabolite evidence for causal visual arrow.",
  "timestamp": "2026-06-29T10:20:00+08:00"
}
```

## Artifacts

```http
GET /api/artifacts
GET /api/artifacts?projectId=project_ah_pd1_crc
```

Returns versioned artifacts with producer agent, provenance, status, path, content hash, and preview.

## Claims

```http
GET /api/claims
```

Returns structured claims typed as observed fact, inference, hypothesis, or recommendation.

## Evidence Graph

```http
GET /api/evidence-graph
```

Returns graph nodes and edges linking papers, evidence items, claims, roadmap nodes, figure elements, and manuscript sections.

## Technical Roadmap

```http
GET /api/roadmap
```

Returns roadmap nodes with inputs, outputs, tools, risks, dependencies, evidence status, related claims, and related artifacts.

## Graphical Abstract

```http
GET /api/graphical-abstract
```

Returns the graphical abstract visual story, layout, prompt, caption, alt text, and element-level evidence links.

## Review

```http
GET /api/review
```

Returns reviewer issues with severity, target artifact, optional target claim, detail, and resolution status.

## Contract Source

The TypeScript API contracts live in:

```text
server/contracts.ts
```

The current in-memory seed store lives in:

```text
server/store.ts
```

Replace `server/store.ts` with a database-backed repository or real agent runtime adapter without changing the frontend contract.
