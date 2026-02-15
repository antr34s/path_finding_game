package com.algofind.dto;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PathfindingResponse {
    private List<PathfindingRequest.Point> path;
    private List<PathfindingRequest.Point> visitedPath;
    private int nodesExplored;
    private long executionTimeMs;
    private boolean pathFound;
    private String algorithm;
}
