package com.algofind.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.algofind.PathfindingRequest;
import com.algofind.PathfindingRequest.Point;
import com.algofind.PathfindingResponse;

@Service
public class DFSService implements PathfindingService {

    private static final int[][] DIRECTIONS_4 = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    private static final int[][] DIRECTIONS_8 = {
        {0, 1}, {1, 0}, {0, -1}, {-1, 0},
        {1, 1}, {1, -1}, {-1, 1}, {-1, -1}
    };

    @Override
    public PathfindingResponse execute(PathfindingRequest request) {
        int gridSize = request.getGridSize();
        Point start = request.getStart();
        Point end = request.getEnd();
        Set<Point> barriers = new HashSet<>(request.getBarriers() != null ? request.getBarriers() : new ArrayList<>());
        boolean allowDiagonal = request.isAllowDiagonal();

        Set<Point> visited = new HashSet<>();
        Map<Point, Point> parent = new HashMap<>();
        List<Point> visitedPath = new ArrayList<>();

        visited.add(start);
        visitedPath.add(start);
        parent.put(start, null);

        boolean found = dfs(start, end, gridSize, barriers, visited, parent, visitedPath, allowDiagonal);

        if (found) {
            List<Point> path = reconstructPath(parent, start, end);
            return new PathfindingResponse(path, visitedPath, visitedPath.size(), 0, true, getAlgorithmName());
        }

        return new PathfindingResponse(new ArrayList<>(), visitedPath, visitedPath.size(), 0, false, getAlgorithmName());
    }

    @Override
    public String getAlgorithmName() {
        return "DFS";
    }

    private boolean dfs(Point current, Point end, int gridSize, Set<Point> barriers,
                       Set<Point> visited, Map<Point, Point> parent, List<Point> visitedPath, boolean allowDiagonal) {
        if (current.equals(end)) {
            return true;
        }

        int[][] directions = allowDiagonal ? DIRECTIONS_8 : DIRECTIONS_4;

        for (int[] direction : directions) {
            int newX = current.getX() + direction[0];
            int newY = current.getY() + direction[1];
            Point neighbor = new Point(newX, newY);

            if (isValid(newX, newY, gridSize) &&
                !barriers.contains(neighbor) &&
                !visited.contains(neighbor)) {

                visited.add(neighbor);
                visitedPath.add(neighbor);
                parent.put(neighbor, current);

                if (dfs(neighbor, end, gridSize, barriers, visited, parent, visitedPath, allowDiagonal)) {
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
}
