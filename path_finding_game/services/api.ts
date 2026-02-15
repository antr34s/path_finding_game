import { API_BASE_URL } from '../utils/config';

export interface PathfindingApiRequest {
  gridSize: number;
  start: { x: number; y: number } | null;
  end: { x: number; y: number } | null;
  barriers: { x: number; y: number; weight: number }[];
  algorithm: string;
  allowDiagonal: boolean;
}

export interface PathfindingApiResponse {
  path: { x: number; y: number }[];
  visitedPath: { x: number; y: number }[];
  nodesExplored: number;
  executionTimeMs: number;
  pathFound: boolean;
  algorithm: string;
}

export async function fetchPathfinding(
  request: PathfindingApiRequest
): Promise<PathfindingApiResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const response = await fetch(`${API_BASE_URL}/api/pathfind`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error ?? `Server error (${response.status})`);
  }

  return response.json();
}
