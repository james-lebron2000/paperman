export type WorkflowState =
  | "INTAKE"
  | "PROTOCOL_PLANNING"
  | "TECHNICAL_ROADMAP_DESIGN"
  | "LITERATURE_SEARCH"
  | "EVIDENCE_EXTRACTION"
  | "CLAIM_SYNTHESIS"
  | "DATA_ANALYSIS"
  | "FIGURE_PLANNING"
  | "GRAPHICAL_ABSTRACT_GENERATION"
  | "MANUSCRIPT_OUTLINE"
  | "SECTION_DRAFTING"
  | "INTERNAL_REVIEW"
  | "REVISION"
  | "READY_FOR_HUMAN";

export interface Project {
  id: string;
  title: string;
  question: string;
  domain: string;
  targetJournalStyle: string;
  activeRunId: string;
  updatedAt: string;
}

export interface WorkflowRun {
  id: string;
  projectId: string;
  state: WorkflowState;
  status: "running" | "blocked" | "completed";
  startedAt: string;
  updatedAt: string;
  progress: number;
}

export interface AgentCard {
  id: string;
  name: string;
  role: string;
  status: "idle" | "queued" | "running" | "blocked" | "completed" | "failed";
  state: WorkflowState;
  currentAction: string;
  toolsUsed: string[];
  inputArtifacts: string[];
  outputArtifacts: string[];
  blockers: string[];
  latestEventAt: string;
}

export interface Artifact {
  id: string;
  projectId: string;
  runId: string;
  type: string;
  title: string;
  path: string;
  version: number;
  producerAgent: string;
  inputArtifacts: string[];
  contentHash: string;
  status: "draft" | "validated" | "rejected" | "approved";
  preview: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowEvent {
  id: string;
  event: string;
  runId: string;
  agent?: string;
  state: WorkflowState;
  detail: string;
  timestamp: string;
}

export interface RunPayload {
  project: Project;
  run: WorkflowRun;
  agents: AgentCard[];
  artifacts: Artifact[];
  events: WorkflowEvent[];
}

export interface EvidenceNode {
  id: string;
  label: string;
  group: "paper" | "evidence" | "claim" | "manuscript" | "figure" | "roadmap";
  status: string;
}

export interface EvidenceEdge {
  source: string;
  target: string;
  label: string;
}

export interface EvidenceGraph {
  nodes: EvidenceNode[];
  edges: EvidenceEdge[];
}

export interface RoadmapNode {
  id: string;
  title: string;
  stage: string;
  inputs: string[];
  outputs: string[];
  tools: string[];
  risks: string[];
  dependencies: string[];
  evidenceStatus: "none" | "partial" | "validated";
  relatedClaims: string[];
  relatedArtifacts: string[];
}

export interface GraphicalAbstractElement {
  id: string;
  panel: string;
  label: string;
  visualDescription: string;
  linkedClaims: string[];
  linkedHypotheses: string[];
  overclaimRisk: "low" | "medium" | "high";
  reviewStatus: "pending" | "approved" | "needs_revision";
}

export interface GraphicalAbstract {
  id: string;
  title: string;
  message: string;
  layout: string;
  prompt: string;
  caption: string;
  altText: string;
  elements: GraphicalAbstractElement[];
}

export interface ReviewIssue {
  id: string;
  severity: "low" | "medium" | "high";
  targetArtifactId: string;
  targetClaimId?: string;
  title: string;
  detail: string;
  status: "open" | "resolved";
}
