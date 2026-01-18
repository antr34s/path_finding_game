package com.algofind.service;

import com.algofind.PathfindingRequest;
import com.algofind.PathfindingRequest.Point;
import com.algofind.PathfindingResponse;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AStarService implements PathfindingService {

    private static final int[][] DIRECTIONS = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    private static class Node implements Comparable<Node> {
        Point point;
        int gScore;
        int fScore;

        Node(Point point, int gScore, int fScore) {
            this.point = point;
            this.gScore = gScore;
            this.fScore = fScore;
        }

        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.fScore, other.fScore);
        }
    }

    @Override
    public PathfindingResponse execute(PathfindingRequest request) {
        int gridSize = request.getGridSize();
        Point start = request.getStart();
        Point end = request.getEnd();
        Set<Point> barriers = new HashSet<>(request.getBarriers() != null ? request.getBarriers() : new ArrayList<>());

        PriorityQueue<Node> openSet = new PriorityQueue<>();
        Map<Point, Integer> gScore = new HashMap<>();
        Map<Point, Point> parent = new HashMap<>();
        Set<Point> closedSet = new HashSet<>();

        int startH = heuristic(start, end);
        openSet.offer(new Node(start, 0, startH));
        gScore.put(start, 0);
        parent.put(start, null);

        int nodesExplored = 0;

        while (!openSet.isEmpty()) {
            Node current = openSet.poll();
            Point currentPoint = current.point;

            if (closedSet.contains(currentPoint)) {
                continue;
            }

            closedSet.add(currentPoint);
            nodesExplored++;

            if (currentPoint.equals(end)) {
                List<Point> path = reconstructPath(parent, start, end);
                return new PathfindingResponse(path, nodesExplored, 0, true, getAlgorithmName());
            }

            for (int[] direction : DIRECTIONS) {
                int newX = currentPoint.getX() + direction[0];
                int newY = currentPoint.getY() + direction[1];
                Point neighbor = new Point(newX, newY);

                if (isValid(newX, newY, gridSize) &&
                    !barriers.contains(neighbor) &&
                    !closedSet.contains(neighbor)) {

                    int tentativeGScore = gScore.get(currentPoint) + 1;

                    if (!gScore.containsKey(neighbor) || tentativeGScore < gScore.get(neighbor)) {
                        gScore.put(neighbor, tentativeGScore);
                        int h = heuristic(neighbor, end);
                        int f = tentativeGScore + h;
                        parent.put(neighbor, currentPoint);
                        openSet.offer(new Node(neighbor, tentativeGScore, f));
                    }
                }
            }
        }

        return new PathfindingResponse(new ArrayList<>(), nodesExplored, 0, false, getAlgorithmName());
    }

    private int heuristic(Point a, Point b) {
        return Math.abs(a.getX() - b.getX()) + Math.abs(a.getY() - b.getY());
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
        return "A_STAR";
    }
}
