package com.algofind.service;

import com.algofind.PathfindingRequest;
import com.algofind.PathfindingRequest.Point;
import com.algofind.PathfindingResponse;
import com.algofind.model.GridGraph;
import com.algofind.util.PathUtils;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DFSService implements PathfindingService {

    @Override
    public PathfindingResponse execute(PathfindingRequest request) {
        GridGraph grid = GridGraph.from(request);
        Point start = request.getStart();
        Point end = request.getEnd();

        Set<Point> visited = new HashSet<>();
        Map<Point, Point> parent = new HashMap<>();
        List<Point> visitedPath = new ArrayList<>();

        visited.add(start);
        visitedPath.add(start);
        parent.put(start, null);

        boolean found = dfs(grid, start, end, visited, parent, visitedPath);

        if (found) {
            List<Point> path = PathUtils.reconstructPath(parent, end);
            return new PathfindingResponse(path, visitedPath, visitedPath.size(), 0, true, getAlgorithmName());
        }

        return new PathfindingResponse(new ArrayList<>(), visitedPath, visitedPath.size(), 0, false, getAlgorithmName());
    }

    private boolean dfs(GridGraph grid, Point current, Point end,
                        Set<Point> visited, Map<Point, Point> parent,
                        List<Point> visitedPath) {
        if (current.equals(end)) {
            return true;
        }

        for (Point neighbor : grid.getNeighbors(current, visited)) {
            if (visited.contains(neighbor)) continue;
            visited.add(neighbor);
            visitedPath.add(neighbor);
            parent.put(neighbor, current);

            if (dfs(grid, neighbor, end, visited, parent, visitedPath)) {
                return true;
            }
        }

        return false;
    }

    @Override
    public String getAlgorithmName() {
        return "DFS";
    }
}
