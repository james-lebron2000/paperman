# Paperman Scientific Agent Workbench PRD

## 1. Product Summary

Paperman is a scientific agent workbench for planning, executing, visualizing, and auditing research manuscript workflows. It is designed for complex biomedical research projects where a manuscript depends on literature evidence, multi-modal data analysis, claim synthesis, technical roadmap design, graphical abstract generation, and iterative scientific review.

The product should not behave like a single chatbot that writes a paper in one shot. It should behave like a scientific operating system: a structured workflow runtime where specialized agents perform bounded tasks, produce versioned artifacts, expose their tool use, and keep every claim traceable to evidence.

The first target use case is translational biomedical research, for example: explaining why AH enhances PD-1 therapy efficacy in colorectal cancer through microbiome, metabolomics, immune remodeling, pathology, spatial proteomics, and clinical association evidence.

## 2. Problem

Scientific manuscript production is currently fragmented across literature search, notes, spreadsheets, notebooks, figures, slide decks, manuscript drafts, and reviewer comments. LLM-based tools can generate prose, but they often fail at evidence traceability, workflow observability, reproducible analysis, and disciplined separation between facts, inferences, and hypotheses.

Researchers need a system that can:

- Break a research goal into executable scientific tasks.
- Coordinate specialized agents rather than relying on one general model.
- Maintain a persistent evidence and claim memory.
- Generate technical roadmaps and graphical abstracts from validated claims.
- Visualize what each agent is doing and what it has produced.
- Review manuscript drafts against citations, evidence, analysis, and reporting guidelines.

## 3. Product Goals

Paperman should help a researcher move from research question to manuscript-ready package through a controlled, auditable workflow.

Primary goals:

- Convert a high-level research goal into structured research task packets.
- Run specialized agents for planning, literature, evidence extraction, analysis, roadmap design, figure design, writing, and review.
- Store all outputs as versioned artifacts with provenance.
- Provide a frontend interface that visualizes workflow state, agent activity, evidence graphs, technical roadmap, graphical abstract, and manuscript sections.
- Ensure every manuscript claim is backed by a paper, dataset, analysis result, or explicitly labeled hypothesis.

Non-goals for the MVP:

- Fully autonomous submission to journals.
- Fully automated wet-lab experiment execution.
- General-purpose chat assistant behavior.
- A large multi-agent marketplace.
- Support for every discipline at launch.

## 4. Target Users

Primary user:

- Biomedical researcher or physician-scientist preparing a mechanism-focused manuscript.

Secondary users:

- Bioinformatics analyst producing reproducible analysis and figures.
- PI or project lead reviewing claims, roadmap, and manuscript logic.
- Scientific illustrator or medical writer refining figures and prose.
- Reviewer-like internal critic checking evidence quality before submission.

## 5. Core Product Concept

Paperman organizes research intelligence as a workflow:

```text
Research Goal
  -> Research Protocol
  -> Technical Roadmap
  -> Literature Search
  -> Evidence Extraction
  -> Claim Graph
  -> Data Analysis
  -> Figure and Graphical Abstract Planning
  -> Manuscript Drafting
  -> Internal Review
  -> Revision
  -> Human Approval
```

The system should treat artifacts as first-class objects. A generated paragraph, claim, chart, roadmap node, graphical abstract panel, and reviewer issue should all have stable IDs, provenance, version history, and status.

## 6. Agent System

### 6.1 Agent List

MVP agents:

- `PlannerAgent`: Converts the research goal into protocol, scope, task packets, acceptance criteria, and execution order.
- `TechnicalRoadmapAgent`: Designs the scientific and technical route, including cohort design, sample collection, assays, computational analysis, validation experiments, milestones, dependencies, and risks.
- `LiteratureAgent`: Searches and screens literature, extracts candidate papers, and summarizes relevance.
- `EvidenceAgent`: Converts papers, data, and analysis outputs into structured evidence items, claims, negative evidence, and confidence labels.
- `AnalysisAgent`: Runs Python/R/Jupyter analysis, statistical tests, and figure generation.
- `GraphicalAbstractAgent`: Converts validated claims and the technical roadmap into a visual story, layout specification, graphical abstract prompt, preview image, caption, and alt text.
- `WriterAgent`: Produces IMRAD outlines and manuscript section drafts from structured evidence only.
- `ReviewerAgent`: Reviews claims, citations, statistics, figures, roadmap logic, reporting guideline compliance, and overstatement risk.

Future specialist agents:

- `MicrobiomeAgent`
- `MetabolomicsAgent`
- `PathologyAgent`
- `SpatialProteomicsAgent`
- `GenomicsAgent`
- `ClinicalTranslationAgent`
- `ExperimentDesignAgent`

### 6.2 Agent Constraints

Agents must not silently invent evidence. Every output should declare which inputs it used.

The `WriterAgent`, `TechnicalRoadmapAgent`, and `GraphicalAbstractAgent` may synthesize and explain, but they must label unsupported mechanisms as hypotheses and link visual or prose elements to claim IDs.

The `ReviewerAgent` must be able to block a workflow state when required evidence, citations, analysis outputs, or human decisions are missing.

## 7. Workflow State Machine

The MVP workflow should use a finite state machine:

```text
INTAKE
PROTOCOL_PLANNING
TECHNICAL_ROADMAP_DESIGN
LITERATURE_SEARCH
EVIDENCE_EXTRACTION
CLAIM_SYNTHESIS
DATA_ANALYSIS
FIGURE_PLANNING
GRAPHICAL_ABSTRACT_GENERATION
MANUSCRIPT_OUTLINE
SECTION_DRAFTING
INTERNAL_REVIEW
REVISION
READY_FOR_HUMAN
```

Failure or blocked states:

```text
BLOCKED_NO_EVIDENCE
BLOCKED_CITATION_CONFLICT
BLOCKED_DATA_MISSING
BLOCKED_STATISTICAL_INVALID
BLOCKED_VISUAL_OVERCLAIM
BLOCKED_HUMAN_DECISION
FAILED_TOOL_ERROR
FAILED_RUNTIME_ERROR
```

Each state transition must emit an event and produce or update at least one artifact.

## 8. Key User Stories

### 8.1 Project Creation

As a researcher, I want to create a new project from a research question so that Paperman can build a scientific workflow.

Acceptance criteria:

- User can enter project title, research question, disease context, modalities, target journal style, and available data.
- System creates a project ID, initial protocol artifact, and first workflow run.
- `PlannerAgent` creates initial task packets and required outputs.

### 8.2 Technical Roadmap Generation

As a researcher, I want a technical roadmap that shows how my hypothesis will be tested so that I can align literature, data, analysis, and validation experiments.

Acceptance criteria:

- `TechnicalRoadmapAgent` produces roadmap nodes with inputs, outputs, tools, risks, dependencies, and deliverables.
- Frontend renders the roadmap as a node-link pipeline.
- Each node can be expanded to show evidence status, risk, downstream dependencies, and related artifacts.
- Roadmap can be exported as SVG/PNG and as a structured YAML/JSON artifact.

### 8.3 Graphical Abstract Generation

As a researcher, I want the system to generate a graphical abstract from validated claims so that the visual summary is scientifically grounded.

Acceptance criteria:

- `GraphicalAbstractAgent` produces visual story, panel layout, figure prompt, image preview, caption, alt text, and evidence links.
- Each graphical element links to a claim ID or hypothesis ID.
- `ReviewerAgent` flags unsupported or visually overstated mechanisms.
- User can compare versions and select an approved graphical abstract.

### 8.4 Agent Activity Visualization

As a user, I want to see what each agent is doing in real time so that I can trust and intervene in the workflow.

Acceptance criteria:

- Frontend shows agent status, current action, current state, tool calls, inputs, outputs, blockers, and latest events.
- User can click an agent card to inspect logs and produced artifacts.
- Tool calls are summarized without hiding important failures.
- Blocked agents show concrete unblock requirements.

### 8.5 Evidence Graph

As a researcher, I want to trace claims back to papers, data, or analyses so that I can verify the manuscript.

Acceptance criteria:

- Frontend displays relationships among papers, evidence items, claims, manuscript sentences, roadmap nodes, and figure elements.
- Claims are typed as observed fact, inference, hypothesis, or recommendation.
- Negative evidence and unchecked scopes are visible.
- User can filter graph by modality, agent, confidence, manuscript section, or evidence type.

### 8.6 Manuscript Drafting

As a researcher, I want manuscript sections drafted from approved evidence so that writing remains traceable.

Acceptance criteria:

- `WriterAgent` generates IMRAD outline before drafting full prose.
- Each paragraph links to claim IDs and citations.
- Drafts are versioned by section.
- `ReviewerAgent` checks unsupported claims, missing citations, duplicated statements, weak transitions, and guideline issues.

## 9. Frontend Requirements

### 9.1 Pages

MVP pages:

- `Dashboard`: Project list, active runs, recent artifacts, blocked workflows.
- `Run View`: Workflow state machine, agent lanes, event stream, active blockers.
- `Artifacts`: Versioned artifact browser with preview for Markdown, JSON/YAML, CSV, images, notebooks, and PDFs.
- `Evidence Graph`: Interactive graph connecting papers, evidence, claims, manuscript sentences, roadmap nodes, and figure elements.
- `Figure Studio`: Graphical abstract and technical roadmap workspace with visual story, layout spec, preview, caption, alt text, and evidence links.
- `Manuscript`: IMRAD outline and section editor with citation and claim side panel.
- `Review`: Reviewer findings, severity, affected artifacts, required fixes, and resolution status.

### 9.2 Main Run View Layout

```text
┌────────────────────────────────────────────────────────────┐
│ Project / Run / Status / Model / Last Updated              │
├───────────────┬──────────────────────────────┬─────────────┤
│ Workflow FSM  │ Agent Lanes                  │ Artifacts   │
│               │                              │             │
│ INTAKE        │ PlannerAgent                 │ protocol    │
│ PLANNING      │ TechnicalRoadmapAgent        │ roadmap     │
│ ROADMAP       │ LiteratureAgent              │ evidence    │
│ LITERATURE    │ EvidenceAgent                │ claims      │
│ EVIDENCE      │ AnalysisAgent                │ figures     │
│ ANALYSIS      │ GraphicalAbstractAgent       │ manuscript  │
│ FIGURES       │ WriterAgent                  │ review      │
│ WRITING       │ ReviewerAgent                │             │
├───────────────┴──────────────────────────────┴─────────────┤
│ Selected Preview / Logs / Evidence / Manuscript / Figure    │
└────────────────────────────────────────────────────────────┘
```

### 9.3 Agent Card

Each agent card should display:

- Agent name and role.
- Status: idle, queued, running, blocked, completed, failed.
- Current workflow state.
- Current action.
- Tools used.
- Input artifacts.
- Output artifacts.
- Blockers.
- Latest event timestamp.

Example:

```yaml
agent: GraphicalAbstractAgent
status: running
state: GRAPHICAL_ABSTRACT_GENERATION
current_action: building visual story from claim graph
inputs:
  - claim_graph.v3
  - technical_roadmap.v2
  - manuscript_key_message.v1
outputs:
  - graphical_abstract_prompt.v1
  - graphical_abstract_preview.png
blockers:
  - missing validated metabolite evidence
```

### 9.4 Figure Studio

Figure Studio should support:

- Graphical abstract visual story editor.
- Technical roadmap visual pipeline.
- Side-by-side preview and evidence links.
- Version comparison.
- Caption and alt text display.
- Reviewer issues attached to visual elements.
- Export to PNG/SVG/PPTX in later versions.

## 10. Backend Requirements

### 10.1 Runtime

The backend should provide a workflow runtime with:

- Project registry.
- Workflow run registry.
- Agent task registry.
- Event stream.
- Artifact store.
- Evidence store.
- Claim graph store.
- Tool execution layer.
- Permission and approval policy.

### 10.2 Event Stream

The frontend should consume server-sent events or WebSocket events.

Required event types:

```text
workflow.created
workflow.state_changed
agent.started
agent.tool_started
agent.tool_finished
agent.artifact_created
agent.artifact_updated
agent.blocked
agent.failed
agent.completed
claim.created
claim.validated
claim.rejected
review.issue_found
review.issue_resolved
human.approval_required
```

Example event:

```json
{
  "event": "agent.tool_started",
  "run_id": "run_20260629_001",
  "agent": "LiteratureAgent",
  "state": "LITERATURE_SEARCH",
  "tool": "pubmed.search",
  "input_summary": "AH PD-1 colorectal cancer microbiome",
  "timestamp": "2026-06-29T10:15:00+08:00"
}
```

## 11. Data Model

### 11.1 ResearchTaskPacket

```yaml
task_id: string
project_id: string
run_id: string
objective: string
scope: protocol | literature | evidence | analysis | roadmap | figure | writing | review
agent: string
inputs: []
required_outputs: []
acceptance_criteria: []
permission_profile: read_only | workspace_write | tool_execution | human_approval
status: created | running | blocked | completed | failed
created_at: datetime
updated_at: datetime
```

### 11.2 Artifact

```yaml
artifact_id: string
project_id: string
run_id: string
type: protocol | roadmap | paper | evidence_table | claim_graph | notebook | figure | graphical_abstract | manuscript_section | review_report
path: string
version: integer
producer_agent: string
input_artifacts: []
content_hash: string
status: draft | validated | rejected | approved
created_at: datetime
updated_at: datetime
```

### 11.3 Claim

```yaml
claim_id: string
kind: observed_fact | inference | hypothesis | recommendation
text: string
confidence: high | medium | low | unknown
evidence_ids: []
negative_evidence_ids: []
used_in:
  manuscript_sections: []
  figure_elements: []
  roadmap_nodes: []
status: proposed | validated | disputed | rejected
```

### 11.4 RoadmapNode

```yaml
node_id: string
title: string
stage: cohort_design | sample_collection | assay | computational_analysis | validation | clinical_translation
inputs: []
outputs: []
tools: []
risks: []
dependencies: []
evidence_status: none | partial | validated
related_claims: []
related_artifacts: []
```

### 11.5 GraphicalAbstractElement

```yaml
element_id: string
panel: string
label: string
visual_description: string
linked_claims: []
linked_hypotheses: []
overclaim_risk: low | medium | high
review_status: pending | approved | needs_revision
```

## 12. Tooling Requirements

MVP tools:

- Local file read/write for project artifacts.
- PDF and text ingestion.
- PMID/DOI metadata ingestion.
- SQLite evidence store.
- Python/Jupyter execution for analysis.
- Image generation or prompt generation for graphical abstract previews.
- Markdown manuscript generation.
- JSON/YAML schema validation.

Later tools:

- PubMed API.
- Crossref/Semantic Scholar/OpenAlex.
- Zotero integration.
- R execution.
- Bioinformatics pipeline adapters.
- Vector database.
- PPTX/SVG export.

## 13. Scientific Quality Requirements

The system must enforce:

- Claims are typed and evidence-linked.
- Negative evidence is stored separately from missing evidence.
- Unchecked scope is explicit.
- Manuscript sections are drafted from approved or clearly labeled evidence.
- Figures and graphical abstracts do not introduce unsupported mechanisms.
- Statistical outputs include method, sample size, effect size, confidence interval where applicable, and source notebook.
- Review findings are actionable and attached to specific artifacts or claims.

## 14. Technical Architecture

Recommended MVP stack:

```text
Frontend:
  React or Next.js
  React Flow for workflow and evidence graph
  TanStack Query for API state
  Zustand for UI state
  Monaco Editor for JSON/YAML/Markdown

Backend:
  FastAPI or Rust Axum
  SQLite for MVP persistence
  SSE or WebSocket for event streaming
  Local artifact filesystem
  Python/Jupyter worker for analysis

Storage:
  projects/
    project_id/
      artifacts/
      runs/
      notebooks/
      figures/
      manuscript/
      evidence.sqlite
```

The architecture should keep the agent runtime separate from the frontend. The frontend observes and controls runs; it should not own scientific state transitions.

## 15. Permissions and Human Approval

Actions requiring human approval:

- Marking a claim as final if evidence is weak or conflicting.
- Approving graphical abstract versions.
- Approving technical roadmap milestones.
- Running destructive file operations.
- Exporting a submission-ready manuscript package.
- Accepting a disputed reviewer issue as resolved.

Permission profiles:

- `read_only`: literature and evidence inspection.
- `workspace_write`: artifact creation and editing.
- `tool_execution`: analysis notebooks and external tools.
- `human_approval`: final approval gates and sensitive decisions.

## 16. MVP Milestones

### Milestone 1: Product Skeleton

- Create project model, run model, artifact model, event model.
- Implement static workflow state machine.
- Build dashboard and run view.

### Milestone 2: Agent Task Packets

- Implement `ResearchTaskPacket`.
- Add agent registry and task lifecycle.
- Show agent cards and event stream in frontend.

### Milestone 3: Evidence and Claim Store

- Implement paper, evidence item, claim, and negative evidence schemas.
- Build evidence graph UI.
- Add artifact provenance.

### Milestone 4: Technical Roadmap

- Implement `TechnicalRoadmapAgent` output schema.
- Render roadmap nodes and dependencies.
- Add roadmap export artifact.

### Milestone 5: Graphical Abstract Studio

- Implement `GraphicalAbstractAgent` output schema.
- Render visual story, layout spec, preview, caption, alt text, and evidence links.
- Add reviewer checks for visual overclaim.

### Milestone 6: Manuscript and Review Loop

- Implement IMRAD outline generation.
- Implement manuscript section artifacts.
- Implement reviewer findings and revision workflow.

## 17. Success Metrics

Product metrics:

- Time from research question to first structured protocol.
- Number of claims with linked evidence.
- Percentage of manuscript sentences linked to claims.
- Number of unsupported claims caught by reviewer.
- Number of graphical abstract elements linked to claims.
- Workflow runs completed without manual state repair.

Scientific quality metrics:

- Citation completeness.
- Evidence coverage by claim.
- Negative evidence visibility.
- Reproducibility of analysis artifacts.
- Reviewer issue resolution rate.

UX metrics:

- User can identify current workflow state within 5 seconds.
- User can identify blocked agent and unblock requirement within 10 seconds.
- User can trace a manuscript claim to evidence within 2 clicks.
- User can inspect a graphical abstract element's evidence link within 2 clicks.

## 18. Open Questions

- Should the first backend be FastAPI for speed or Rust Axum for alignment with the `claw-code` reference architecture?
- Should literature search start with manual PMID/DOI/PDF ingestion before external APIs?
- Should graphical abstract generation produce bitmap previews only, or also editable SVG/PPTX specs in MVP?
- Should project memory use SQLite only first, or SQLite plus vector search from the start?
- Which manuscript style should be the first target: Nature-style article, biomedical original research, review article, or grant-style proposal?

## 19. Recommended MVP Decision

The first MVP should prioritize observability and traceability over autonomy. The system should prove that a researcher can see each agent's actions, inspect artifacts, trace claims to evidence, and generate a technical roadmap plus graphical abstract without losing scientific provenance.

The strongest initial product slice is:

```text
Research Goal
  -> PlannerAgent
  -> TechnicalRoadmapAgent
  -> EvidenceAgent with manual paper/PDF inputs
  -> GraphicalAbstractAgent
  -> ReviewerAgent
  -> Frontend Run View + Evidence Graph + Figure Studio
```

This avoids premature complexity while validating the product's core thesis: scientific agents become useful when their operations, evidence, and outputs are visible, structured, and reviewable.
