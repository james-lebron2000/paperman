import type {
  EvidenceGraph,
  GraphicalAbstract,
  ReviewIssue,
  RoadmapNode,
  RunPayload
} from "./types";

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export function fetchRun(runId: string) {
  return getJson<RunPayload>(`/api/runs/${runId}`);
}

export function fetchEvidenceGraph() {
  return getJson<EvidenceGraph>("/api/evidence-graph");
}

export function fetchRoadmap() {
  return getJson<{ nodes: RoadmapNode[] }>("/api/roadmap");
}

export function fetchGraphicalAbstract() {
  return getJson<GraphicalAbstract>("/api/graphical-abstract");
}

export function fetchReviewIssues() {
  return getJson<{ issues: ReviewIssue[] }>("/api/review");
}
