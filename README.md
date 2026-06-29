# Paperman

Paperman is a scientific agent workbench for manuscript-oriented research workflows. It visualizes agent operations, workflow state, artifacts, evidence graphs, technical roadmaps, graphical abstract design, and internal review findings.

The current implementation is an MVP full-stack scaffold based on [PRD.md](./PRD.md):

- Express API server with typed contracts.
- Server-sent events endpoint for workflow and agent events.
- React/Vite frontend workbench.
- Seed data for the AH + PD-1 colorectal cancer research scenario.
- API interfaces designed so the seeded runtime can later be replaced by real agents.

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Main Surfaces

- `Run View`: workflow state machine, agent lanes, blockers, artifact preview, event stream.
- `Artifacts`: versioned research outputs and provenance.
- `Evidence Graph`: paper -> evidence -> claim -> roadmap/figure/manuscript relationships.
- `Roadmap`: technical execution plan from cohort design to validation.
- `Figure Studio`: graphical abstract visual story, layout prompt, caption, alt text, evidence links.
- `Review`: reviewer issues attached to artifacts and claims.

## API

See [docs/API.md](./docs/API.md).
