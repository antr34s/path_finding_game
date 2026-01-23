package com.algofind.service;

import com.algofind.PathfindingRequest;
import com.algofind.PathfindingRequest.Point;
import com.algofind.PathfindingResponse;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DijkstraService implements PathfindingService {

    private static final int[][] DIRECTIONS = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    private final Random random = new Random();

    private static class Node implements Comparable<Node> {
        Point point;
        int distance;

        Node(Point point, int distance) {
            this.point = point;
            this.distance = distance;
        }

        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.distance, other.distance);
        }
    }

    @Override
    public PathfindingResponse execute(PathfindingRequest request) {
        int gridSize = request.getGridSize();
        Point start = request.getStart();
        Point end = request.getEnd();
        Set<Point> barriers = new HashSet<>(request.getBarriers() != null ? request.getBarriers() : new ArrayList<>());

        PriorityQueue<Node> pq = new PriorityQueue<>();
        Map<Point, Integer> distances = new HashMap<>();
        Map<Point, Point> parent = new HashMap<>();
        Set<Point> visited = new HashSet<>();
        List<Point> visitedPath = new ArrayList<>();

        pq.offer(new Node(start, 0));
        distances.put(start, 0);
        parent.put(start, null);

        int nodesExplored = 0;

        while (!pq.isEmpty()) {
            Node current = pq.poll();
            Point currentPoint = current.point;

            if (visited.contains(currentPoint)) {
                continue;
            }

            visited.add(currentPoint);
            visitedPath.add(currentPoint);
            nodesExplored++;

            if (currentPoint.equals(end)) {
                List<Point> path = reconstructPath(parent, start, end);
                return new PathfindingResponse(path, visitedPath, nodesExplored, 0, true, getAlgorithmName());
            }

            List<Point> neighbors = getShuffledNeighbors(currentPoint, gridSize, barriers, visited, distances);

            for (Point neighbor : neighbors) {
                int newDistance = distances.get(currentPoint) + 1;

                if (!distances.containsKey(neighbor) || newDistance < distances.get(neighbor)) {
                    distances.put(neighbor, newDistance);
                    parent.put(neighbor, currentPoint);
                    pq.offer(new Node(neighbor, newDistance));
                }
            }
        }

        return new PathfindingResponse(new ArrayList<>(), visitedPath, nodesExplored, 0, false, getAlgorithmName());
    }

    private List<Point> getShuffledNeighbors(Point current, int gridSize, Set<Point> barriers, Set<Point> visited, Map<Point, Integer> distances) {
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
        return "DIJKSTRA";
    }
}
