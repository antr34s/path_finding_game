package com.algofind.service;

import com.algofind.PathfindingRequest;
import com.algofind.PathfindingRequest.Point;
import com.algofind.PathfindingResponse;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DFSService implements PathfindingService {

    private static final int[][] DIRECTIONS = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    private final Random random = new Random();
    private int nodesExplored;
    private List<Point> visitedPath;

    @Override
    public PathfindingResponse execute(PathfindingRequest request) {
        int gridSize = request.getGridSize();
        Point start = request.getStart();
        Point end = request.getEnd();
        Set<Point> barriers = new HashSet<>(request.getBarriers() != null ? request.getBarriers() : new ArrayList<>());

        Set<Point> visited = new HashSet<>();
        Map<Point, Point> parent = new HashMap<>();
        visitedPath = new ArrayList<>();
        nodesExplored = 0;

        visitedPath.add(start);
        boolean found = dfs(start, end, gridSize, barriers, visited, parent);

        if (found) {
            List<Point> path = reconstructPath(parent, start, end);
            return new PathfindingResponse(path, visitedPath, nodesExplored, 0, true, getAlgorithmName());
        }

        return new PathfindingResponse(new ArrayList<>(), visitedPath, nodesExplored, 0, false, getAlgorithmName());
    }

    private boolean dfs(Point current, Point end, int gridSize, Set<Point> barriers,
                       Set<Point> visited, Map<Point, Point> parent) {
        if (current.equals(end)) {
            nodesExplored++;
            return true;
        }

        visited.add(current);
        nodesExplored++;

        List<Point> neighbors = getShuffledNeighbors(current, gridSize, barriers, visited);

        for (Point neighbor : neighbors) {
            parent.put(neighbor, current);
            visitedPath.add(neighbor);
            if (dfs(neighbor, end, gridSize, barriers, visited, parent)) {
                return true;
            }
        }

        return false;
    }

    private List<Point> getShuffledNeighbors(Point current, int gridSize, Set<Point> barriers, Set<Point> visited) {
        List<Point> neighbors = new ArrayList<>();

        for (int[] direction : DIRECTIONS) {
            int newX = current.getX() + direction[0];
            int newY = current.getY() + direction[1];
            Point neighbor = new Point(newX, newY);

            if (isValid(newX, newY, gridSize) &&
                !barriers.contains(neighbor) &&
                !visited.contains(neighbor)) {
                neighbors.add(neighbor);
            }
        }

        Collections.shuffle(neighbors, random);
        return neighbors;
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
