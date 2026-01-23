package com.algofind;

import java.util.List;

public class PathfindingResponse {
    private List<PathfindingRequest.Point> path;
    private List<PathfindingRequest.Point> visitedPath;
    private int nodesExplored;
    private long executionTimeMs;
    private boolean pathFound;
    private String algorithm;

    public PathfindingResponse() {}

    public PathfindingResponse(List<PathfindingRequest.Point> path, List<PathfindingRequest.Point> visitedPath,
                              int nodesExplored, long executionTimeMs, boolean pathFound, String algorithm) {
        this.path = path;
        this.visitedPath = visitedPath;
        this.nodesExplored = nodesExplored;
        this.executionTimeMs = executionTimeMs;
        this.pathFound = pathFound;
        this.algorithm = algorithm;
    }

    public List<PathfindingRequest.Point> getPath() {
        return path;
    }

    public void setPath(List<PathfindingRequest.Point> path) {
        this.path = path;
    }

    public int getNodesExplored() {
        return nodesExplored;
    }

    public void setNodesExplored(int nodesExplored) {
        this.nodesExplored = nodesExplored;
    }

    public long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(long executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }

    public boolean isPathFound() {
        return pathFound;
    }

    public void setPathFound(boolean pathFound) {
        this.pathFound = pathFound;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public List<PathfindingRequest.Point> getVisitedPath() {
        return visitedPath;
    }

    public void setVisitedPath(List<PathfindingRequest.Point> visitedPath) {
        this.visitedPath = visitedPath;
    }
}
