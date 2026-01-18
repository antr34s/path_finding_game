package com.algofind.service;

import com.algofind.PathfindingRequest;
import com.algofind.PathfindingRequest.Point;
import com.algofind.PathfindingResponse;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DFSService implements PathfindingService {

    private static final int[][] DIRECTIONS = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    private int nodesExplored;

    @Override
    public PathfindingResponse execute(PathfindingRequest request) {
        int gridSize = request.getGridSize();
        Point start = request.getStart();
        Point end = request.getEnd();
        Set<Point> barriers = new HashSet<>(request.getBarriers() != null ? request.getBarriers() : new ArrayList<>());

        Set<Point> visited = new HashSet<>();
        Map<Point, Point> parent = new HashMap<>();
        nodesExplored = 0;

        boolean found = dfs(start, end, gridSize, barriers, visited, parent);

        if (found) {
            List<Point> path = reconstructPath(parent, start, end);
            return new PathfindingResponse(path, nodesExplored, 0, true, getAlgorithmName());
        }

        return new PathfindingResponse(new ArrayList<>(), nodesExplored, 0, false, getAlgorithmName());
    }

    private boolean dfs(Point current, Point end, int gridSize, Set<Point> barriers,
                       Set<Point> visited, Map<Point, Point> parent) {
        if (current.equals(end)) {
            nodesExplored++;
            return true;
        }

        visited.add(current);
        nodesExplored++;

        for (int[] direction : DIRECTIONS) {
            int newX = current.getX() + direction[0];
            int newY = current.getY() + direction[1];
            Point neighbor = new Point(newX, newY);

            if (isValid(newX, newY, gridSize) &&
                !barriers.contains(neighbor) &&
                !visited.contains(neighbor)) {

                parent.put(neighbor, current);
                if (dfs(neighbor, end, gridSize, barriers, visited, parent)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean isValid(int x, int y, int gridSize) {
        return x >= 0 && x < gridSize && y >= 0 && y < gridSize;
    }

    private List<Point> reconstructPath(Map<Point, Point> parent, Point start, Point end) {
        List<Point> path = new ArrayList<>();
        Point current = end;

        while (current != null) {
            path.add(0, current);
            current = parent.get(current);
        }

        return path;
    }

    @Override
    public String getAlgorithmName() {
        return "DFS";
    }
}
