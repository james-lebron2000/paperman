import type {
  AgentCard,
  Artifact,
  Claim,
  EvidenceGraph,
  GraphicalAbstract,
  Project,
  ReviewIssue,
  RoadmapNode,
  WorkflowEvent,
  WorkflowRun,
  WorkflowState
} from "./contracts";

const now = "2026-06-29T10:20:00+08:00";

export const workflowStates: WorkflowState[] = [
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

export const projects: Project[] = [
  {
    id: "project_ah_pd1_crc",
    title: "AH enhances PD-1 response in colorectal cancer",
    question: "Why does AH enhance PD-1 efficacy through microbiome-metabolite-immune remodeling?",
    domain: "translational colorectal cancer immunotherapy",
    targetJournalStyle: "Nature-style biomedical article",
    activeRunId: "run_20260629_001",
    updatedAt: now
  }
];

export const runs: WorkflowRun[] = [
  {
    id: "run_20260629_001",
    projectId: "project_ah_pd1_crc",
    state: "GRAPHICAL_ABSTRACT_GENERATION",
    status: "blocked",
    startedAt: "2026-06-29T09:40:00+08:00",
    updatedAt: now,
    progress: 64
  }
];

export const agents: AgentCard[] = [
  {
    id: "planner",
    name: "PlannerAgent",
    role: "Protocol and task decomposition",
    status: "completed",
    state: "PROTOCOL_PLANNING",
    currentAction: "Created research protocol and task packet backlog",
    toolsUsed: ["schema.validate", "artifact.write"],
    inputArtifacts: [],
    outputArtifacts: ["artifact_protocol_v1"],
    blockers: [],
    latestEventAt: "2026-06-29T09:48:00+08:00"
  },
  {
    id: "roadmap",
    name: "TechnicalRoadmapAgent",
    role: "Study design and technical execution plan",
    status: "completed",
    state: "TECHNICAL_ROADMAP_DESIGN",
    currentAction: "Roadmap v2 validated with assay and analysis dependencies",
    toolsUsed: ["evidence.query", "roadmap.render", "artifact.write"],
    inputArtifacts: ["artifact_protocol_v1"],
    outputArtifacts: ["artifact_roadmap_v2"],
    blockers: [],
    latestEventAt: "2026-06-29T09:57:00+08:00"
  },
  {
    id: "literature",
    name: "LiteratureAgent",
    role: "Search, screening, and source triage",
    status: "completed",
    state: "LITERATURE_SEARCH",
    currentAction: "Screened seed literature and retained 18 mechanistic candidates",
    toolsUsed: ["pubmed.search", "doi.lookup", "pdf.extract"],
    inputArtifacts: ["artifact_protocol_v1"],
    outputArtifacts: ["artifact_evidence_table_v1"],
    blockers: [],
    latestEventAt: "2026-06-29T10:04:00+08:00"
  },
  {
    id: "evidence",
    name: "EvidenceAgent",
    role: "Claim graph and negative evidence extraction",
    status: "completed",
    state: "CLAIM_SYNTHESIS",
    currentAction: "Generated validated claim graph with hypothesis labels",
    toolsUsed: ["evidence.extract", "claim.classify", "negative_evidence.record"],
    inputArtifacts: ["artifact_evidence_table_v1"],
    outputArtifacts: ["artifact_claim_graph_v3"],
    blockers: [],
    latestEventAt: "2026-06-29T10:08:00+08:00"
  },
  {
    id: "analysis",
    name: "AnalysisAgent",
    role: "Statistical analysis and reproducible figures",
    status: "running",
    state: "DATA_ANALYSIS",
    currentAction: "Checking microbiome-metabolite association model diagnostics",
    toolsUsed: ["python.exec", "notebook.write", "stats.report"],
    inputArtifacts: ["artifact_claim_graph_v3"],
    outputArtifacts: ["artifact_analysis_notebook_v1"],
    blockers: [],
    latestEventAt: "2026-06-29T10:18:00+08:00"
  },
  {
    id: "graphical",
    name: "GraphicalAbstractAgent",
    role: "Evidence-linked visual story and graphical abstract",
    status: "blocked",
    state: "GRAPHICAL_ABSTRACT_GENERATION",
    currentAction: "Waiting for metabolite evidence before approving middle panel",
    toolsUsed: ["figure_prompt.generate", "visual_story.plan"],
    inputArtifacts: ["artifact_claim_graph_v3", "artifact_roadmap_v2"],
    outputArtifacts: ["artifact_graphical_abstract_v1"],
    blockers: ["Missing validated metabolite evidence for the mechanism bridge"],
    latestEventAt: now
  },
  {
    id: "writer",
    name: "WriterAgent",
    role: "IMRAD outline and manuscript drafting",
    status: "queued",
    state: "MANUSCRIPT_OUTLINE",
    currentAction: "Queued until graphical abstract and claim graph pass review",
    toolsUsed: [],
    inputArtifacts: ["artifact_claim_graph_v3"],
    outputArtifacts: [],
    blockers: [],
    latestEventAt: "2026-06-29T10:12:00+08:00"
  },
  {
    id: "reviewer",
    name: "ReviewerAgent",
    role: "Evidence, statistics, visual overclaim, and manuscript review",
    status: "running",
    state: "INTERNAL_REVIEW",
    currentAction: "Opened visual overclaim issue for metabolite-to-immunity arrow",
    toolsUsed: ["claim.audit", "figure.audit", "reporting.checklist"],
    inputArtifacts: ["artifact_graphical_abstract_v1", "artifact_claim_graph_v3"],
    outputArtifacts: ["artifact_review_report_v1"],
    blockers: [],
    latestEventAt: "2026-06-29T10:19:00+08:00"
  }
];

export const artifacts: Artifact[] = [
  {
    id: "artifact_protocol_v1",
    projectId: "project_ah_pd1_crc",
    runId: "run_20260629_001",
    type: "protocol",
    title: "Research protocol v1",
    path: "projects/project_ah_pd1_crc/artifacts/protocol.yaml",
    version: 1,
    producerAgent: "PlannerAgent",
    inputArtifacts: [],
    contentHash: "sha256:protocol001",
    status: "validated",
    preview: "Defines the AH + PD-1 colorectal cancer research question, modalities, task packets, and acceptance gates.",
    createdAt: "2026-06-29T09:48:00+08:00",
    updatedAt: "2026-06-29T09:48:00+08:00"
  },
  {
    id: "artifact_roadmap_v2",
    projectId: "project_ah_pd1_crc",
    runId: "run_20260629_001",
    type: "roadmap",
    title: "Technical roadmap v2",
    path: "projects/project_ah_pd1_crc/artifacts/technical_roadmap.json",
    version: 2,
    producerAgent: "TechnicalRoadmapAgent",
    inputArtifacts: ["artifact_protocol_v1"],
    contentHash: "sha256:roadmap002",
    status: "validated",
    preview: "Cohort design to validation pipeline covering stool microbiome, metabolomics, spatial immune profiling, and clinical response association.",
    createdAt: "2026-06-29T09:57:00+08:00",
    updatedAt: "2026-06-29T09:59:00+08:00"
  },
  {
    id: "artifact_evidence_table_v1",
    projectId: "project_ah_pd1_crc",
    runId: "run_20260629_001",
    type: "evidence_table",
    title: "Evidence extraction table v1",
    path: "projects/project_ah_pd1_crc/artifacts/evidence_table.csv",
    version: 1,
    producerAgent: "LiteratureAgent",
    inputArtifacts: ["artifact_protocol_v1"],
    contentHash: "sha256:evidence001",
    status: "validated",
    preview: "18 retained papers with source, mechanism category, extracted finding, and confidence notes.",
    createdAt: "2026-06-29T10:04:00+08:00",
    updatedAt: "2026-06-29T10:04:00+08:00"
  },
  {
    id: "artifact_claim_graph_v3",
    projectId: "project_ah_pd1_crc",
    runId: "run_20260629_001",
    type: "claim_graph",
    title: "Claim graph v3",
    path: "projects/project_ah_pd1_crc/artifacts/claim_graph.json",
    version: 3,
    producerAgent: "EvidenceAgent",
    inputArtifacts: ["artifact_evidence_table_v1"],
    contentHash: "sha256:claims003",
    status: "validated",
    preview: "Evidence-linked claims separating observed facts, inferences, and hypotheses for the AH to PD-1 response mechanism.",
    createdAt: "2026-06-29T10:08:00+08:00",
    updatedAt: "2026-06-29T10:11:00+08:00"
  },
  {
    id: "artifact_graphical_abstract_v1",
    projectId: "project_ah_pd1_crc",
    runId: "run_20260629_001",
    type: "graphical_abstract",
    title: "Graphical abstract concept v1",
    path: "projects/project_ah_pd1_crc/figures/graphical_abstract_v1.png",
    version: 1,
    producerAgent: "GraphicalAbstractAgent",
    inputArtifacts: ["artifact_claim_graph_v3", "artifact_roadmap_v2"],
    contentHash: "sha256:ga001",
    status: "draft",
    preview: "Three-panel landscape concept: AH intervention, microbiome-metabolite remodeling, enhanced PD-1 anti-tumor immunity.",
    createdAt: "2026-06-29T10:16:00+08:00",
    updatedAt: now
  },
  {
    id: "artifact_review_report_v1",
    projectId: "project_ah_pd1_crc",
    runId: "run_20260629_001",
    type: "review_report",
    title: "Internal review report v1",
    path: "projects/project_ah_pd1_crc/artifacts/reviewer_report.md",
    version: 1,
    producerAgent: "ReviewerAgent",
    inputArtifacts: ["artifact_claim_graph_v3", "artifact_graphical_abstract_v1"],
    contentHash: "sha256:review001",
    status: "draft",
    preview: "Flags visual overclaim risk, missing metabolite validation, and manuscript gating requirements.",
    createdAt: "2026-06-29T10:19:00+08:00",
    updatedAt: "2026-06-29T10:19:00+08:00"
  }
];

export const claims: Claim[] = [
  {
    id: "claim_microbiome_001",
    kind: "observed_fact",
    text: "AH is associated with a shift in gut microbiome composition in the treatment context.",
    confidence: "medium",
    evidenceIds: ["evidence_paper_012"],
    negativeEvidenceIds: [],
    usedIn: ["roadmap_microbiome", "ga_panel_2"],
    status: "validated"
  },
  {
    id: "claim_metabolite_002",
    kind: "hypothesis",
    text: "AH-induced metabolite changes may mediate immune remodeling that improves PD-1 responsiveness.",
    confidence: "low",
    evidenceIds: ["evidence_paper_017"],
    negativeEvidenceIds: ["negative_metabolite_direct_crc"],
    usedIn: ["roadmap_metabolomics", "ga_panel_2"],
    status: "proposed"
  },
  {
    id: "claim_immunity_003",
    kind: "inference",
    text: "Microbiome and metabolite remodeling plausibly converges on a more inflamed and PD-1-responsive tumor immune microenvironment.",
    confidence: "medium",
    evidenceIds: ["evidence_paper_008", "analysis_spatial_001"],
    negativeEvidenceIds: [],
    usedIn: ["roadmap_spatial", "ga_panel_3"],
    status: "validated"
  }
];

export const evidenceGraph: EvidenceGraph = {
  nodes: [
    { id: "paper_012", label: "Paper 012", group: "paper", status: "screened" },
    { id: "paper_017", label: "Paper 017", group: "paper", status: "screened" },
    { id: "evidence_paper_012", label: "Microbiome shift evidence", group: "evidence", status: "validated" },
    { id: "evidence_paper_017", label: "Metabolite candidate evidence", group: "evidence", status: "partial" },
    { id: "claim_microbiome_001", label: "AH changes microbiome", group: "claim", status: "validated" },
    { id: "claim_metabolite_002", label: "Metabolite bridge", group: "claim", status: "proposed" },
    { id: "claim_immunity_003", label: "Immune remodeling", group: "claim", status: "validated" },
    { id: "roadmap_metabolomics", label: "Metabolomics node", group: "roadmap", status: "partial" },
    { id: "ga_panel_2", label: "GA middle panel", group: "figure", status: "needs_revision" },
    { id: "intro_p3", label: "Introduction paragraph 3", group: "manuscript", status: "queued" }
  ],
  edges: [
    { source: "paper_012", target: "evidence_paper_012", label: "extracts" },
    { source: "paper_017", target: "evidence_paper_017", label: "extracts" },
    { source: "evidence_paper_012", target: "claim_microbiome_001", label: "supports" },
    { source: "evidence_paper_017", target: "claim_metabolite_002", label: "partially supports" },
    { source: "claim_metabolite_002", target: "roadmap_metabolomics", label: "requires validation" },
    { source: "claim_metabolite_002", target: "ga_panel_2", label: "visualizes" },
    { source: "claim_microbiome_001", target: "ga_panel_2", label: "visualizes" },
    { source: "claim_immunity_003", target: "intro_p3", label: "draft input" }
  ]
};

export const roadmap: RoadmapNode[] = [
  {
    id: "roadmap_cohort",
    title: "Cohort design",
    stage: "cohort_design",
    inputs: ["CRC patients receiving PD-1 blockade", "AH exposure annotation"],
    outputs: ["response groups", "sampling schedule"],
    tools: ["protocol builder", "power calculation"],
    risks: ["small responder subgroup", "confounding by antibiotics"],
    dependencies: [],
    evidenceStatus: "validated",
    relatedClaims: [],
    relatedArtifacts: ["artifact_protocol_v1"]
  },
  {
    id: "roadmap_microbiome",
    title: "Microbiome profiling",
    stage: "assay",
    inputs: ["stool samples", "baseline and on-treatment timepoints"],
    outputs: ["taxa abundance matrix", "diversity metrics"],
    tools: ["16S pipeline", "metagenomics adapter"],
    risks: ["batch effect", "dietary confounding"],
    dependencies: ["roadmap_cohort"],
    evidenceStatus: "validated",
    relatedClaims: ["claim_microbiome_001"],
    relatedArtifacts: ["artifact_evidence_table_v1"]
  },
  {
    id: "roadmap_metabolomics",
    title: "Metabolomics bridge",
    stage: "computational_analysis",
    inputs: ["plasma samples", "stool metabolite profiles"],
    outputs: ["metabolite abundance matrix", "pathway enrichment"],
    tools: ["Python", "R", "pathway database"],
    risks: ["missing direct CRC evidence", "multiple testing"],
    dependencies: ["roadmap_microbiome"],
    evidenceStatus: "partial",
    relatedClaims: ["claim_metabolite_002"],
    relatedArtifacts: ["artifact_claim_graph_v3"]
  },
  {
    id: "roadmap_spatial",
    title: "Spatial immune profiling",
    stage: "validation",
    inputs: ["tumor tissue", "IHC or spatial proteomics"],
    outputs: ["immune neighborhood map", "PD-1 response association"],
    tools: ["image analysis", "spatial statistics"],
    risks: ["tissue availability", "region selection bias"],
    dependencies: ["roadmap_metabolomics"],
    evidenceStatus: "partial",
    relatedClaims: ["claim_immunity_003"],
    relatedArtifacts: ["artifact_claim_graph_v3"]
  }
];

export const graphicalAbstract: GraphicalAbstract = {
  id: "graphical_abstract_v1",
  title: "AH remodels microbiome-metabolite-immune interactions",
  message: "AH may enhance PD-1 response by shifting gut microbiome states, altering metabolite signals, and promoting a more responsive tumor immune microenvironment.",
  layout: "landscape-three-panel",
  prompt:
    "Nature-style biomedical graphical abstract, landscape three-panel layout: left AH intervention in colorectal cancer immunotherapy, center microbiome and metabolite remodeling with uncertainty marker, right enhanced anti-tumor immune response under PD-1 blockade. Minimal labels, clean arrows, no unsupported causal certainty.",
  caption:
    "Conceptual graphical abstract linking AH exposure to microbiome remodeling, candidate metabolite-mediated immune changes, and improved PD-1 responsiveness in colorectal cancer. The metabolite bridge remains hypothesis-labeled pending validation.",
  altText:
    "Three-panel schematic showing AH intervention, microbiome and metabolite remodeling, and downstream tumor immune activation during PD-1 therapy.",
  elements: [
    {
      id: "ga_panel_1",
      panel: "left",
      label: "AH + PD-1 treatment context",
      visualDescription: "CRC tumor and treatment cue with AH intervention entering the workflow.",
      linkedClaims: [],
      linkedHypotheses: [],
      overclaimRisk: "low",
      reviewStatus: "approved"
    },
    {
      id: "ga_panel_2",
      panel: "middle",
      label: "Microbiome-metabolite remodeling",
      visualDescription: "Gut microbial community shifts and metabolite nodes connected by a dashed hypothesis arrow.",
      linkedClaims: ["claim_microbiome_001"],
      linkedHypotheses: ["claim_metabolite_002"],
      overclaimRisk: "high",
      reviewStatus: "needs_revision"
    },
    {
      id: "ga_panel_3",
      panel: "right",
      label: "Immune response under PD-1 blockade",
      visualDescription: "Activated immune cells entering tumor microenvironment with PD-1 response annotation.",
      linkedClaims: ["claim_immunity_003"],
      linkedHypotheses: [],
      overclaimRisk: "medium",
      reviewStatus: "pending"
    }
  ]
};

export const reviewIssues: ReviewIssue[] = [
  {
    id: "review_visual_001",
    severity: "high",
    targetArtifactId: "artifact_graphical_abstract_v1",
    targetClaimId: "claim_metabolite_002",
    title: "Metabolite bridge is visually too causal",
    detail:
      "The graphical abstract middle panel uses a solid arrow from microbiome shift to immune remodeling, but current evidence only supports a hypothesis. Use dashed arrow or add validation requirement.",
    status: "open"
  },
  {
    id: "review_stats_002",
    severity: "medium",
    targetArtifactId: "artifact_claim_graph_v3",
    title: "Analysis notebook should report model diagnostics",
    detail:
      "The microbiome-metabolite association result needs sample size, covariates, effect size, confidence interval, and multiple-testing correction before manuscript drafting.",
    status: "open"
  }
];

export const events: WorkflowEvent[] = [
  {
    id: "evt_001",
    event: "workflow.state_changed",
    runId: "run_20260629_001",
    agent: "PlannerAgent",
    state: "PROTOCOL_PLANNING",
    detail: "Research protocol v1 created from user goal.",
    timestamp: "2026-06-29T09:48:00+08:00"
  },
  {
    id: "evt_002",
    event: "agent.artifact_created",
    runId: "run_20260629_001",
    agent: "TechnicalRoadmapAgent",
    state: "TECHNICAL_ROADMAP_DESIGN",
    detail: "Technical roadmap v2 created with four executable stages.",
    timestamp: "2026-06-29T09:57:00+08:00"
  },
  {
    id: "evt_003",
    event: "claim.validated",
    runId: "run_20260629_001",
    agent: "EvidenceAgent",
    state: "CLAIM_SYNTHESIS",
    detail: "Validated microbiome and immune remodeling claims; metabolite bridge remains hypothesis.",
    timestamp: "2026-06-29T10:08:00+08:00"
  },
  {
    id: "evt_004",
    event: "agent.blocked",
    runId: "run_20260629_001",
    agent: "GraphicalAbstractAgent",
    state: "GRAPHICAL_ABSTRACT_GENERATION",
    detail: "Blocked by missing validated metabolite evidence for causal visual arrow.",
    timestamp: now
  }
];
