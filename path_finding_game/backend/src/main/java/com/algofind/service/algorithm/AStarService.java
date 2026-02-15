package com.algofind.service.algorithm;

import com.algofind.dto.PathfindingRequest;
import com.algofind.dto.PathfindingRequest.Point;
import com.algofind.dto.PathfindingResponse;
import com.algofind.model.GridGraph;
import com.algofind.service.PathfindingService;
import com.algofind.util.PathUtils;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AStarService implements PathfindingService {

    private static final double SQRT2 = Math.sqrt(2);
    private static final double WEIGHT = 1.0;

    private static class Node implements Comparable<Node> {
        final Point point;
        final double gScore;
        final double fScore;

        Node(Point point, double gScore, double fScore) {
            this.point = point;
            this.gScore = gScore;
            this.fScore = fScore;
        }

        @Override
        public int compareTo(Node other) {
            return Double.compare(this.fScore, other.fScore);
        }
    }

    @Override
    public PathfindingResponse execute(PathfindingRequest request) {
        GridGraph grid = GridGraph.from(request);
        Point start = request.getStart();
        Point end = request.getEnd();

        PriorityQueue<Node> openSet = new PriorityQueue<>();
        Map<Point, Double> gScore = new HashMap<>();
        Map<Point, Point> parent = new HashMap<>();
        Set<Point> closedSet = new HashSet<>();
        List<Point> visitedPath = new ArrayList<>();

        double startH = heuristic(start, end, grid.isAllowDiagonal());
        openSet.offer(new Node(start, 0, startH));
        gScore.put(start, 0.0);
        parent.put(start, null);

        int nodesExplored = 0;

        while (!openSet.isEmpty()) {
            Node current = openSet.poll();
            Point currentPoint = current.point;

            if (closedSet.contains(currentPoint)) {
                continue;
            }

            closedSet.add(currentPoint);
            visitedPath.add(currentPoint);
            nodesExplored++;

            if (currentPoint.equals(end)) {
                List<Point> path = PathUtils.reconstructPath(parent, end);
                return new PathfindingResponse(path, visitedPath, nodesExplored, 0, true, getAlgorithmName());
            }

            for (Point neighbor : grid.getNeighbors(currentPoint, closedSet)) {
                double movementCost = grid.getMovementCost(currentPoint, neighbor);
                double tentativeGScore = gScore.get(currentPoint) + movementCost;

                if (!gScore.containsKey(neighbor) || tentativeGScore < gScore.get(neighbor)) {
                    gScore.put(neighbor, tentativeGScore);
                    double h = heuristic(neighbor, end, grid.isAllowDiagonal());
                    double f = tentativeGScore + WEIGHT * h;
                    parent.put(neighbor, currentPoint);
                    openSet.offer(new Node(neighbor, tentativeGScore, f));
                }
            }
        }

        return new PathfindingResponse(new ArrayList<>(), visitedPath, nodesExplored, 0, false, getAlgorithmName());
    }

    private double heuristic(Point a, Point b, boolean allowDiagonal) {
        int dx = Math.abs(a.getX() - b.getX());
        int dy = Math.abs(a.getY() - b.getY());

        if (allowDiagonal) {
            return dx + dy + (SQRT2 - 2) * Math.min(dx, dy);
        } else {
            return dx + dy;
        }
    }

    @Override
    public String getAlgorithmName() {
        return "A_STAR";
    }
}
