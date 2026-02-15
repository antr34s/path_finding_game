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
public class DijkstraService implements PathfindingService {

    private static class Node implements Comparable<Node> {
        final Point point;
        final double distance;

        Node(Point point, double distance) {
            this.point = point;
            this.distance = distance;
        }

        @Override
        public int compareTo(Node other) {
            return Double.compare(this.distance, other.distance);
        }
    }

    @Override
    public PathfindingResponse execute(PathfindingRequest request) {
        GridGraph grid = GridGraph.from(request);
        Point start = request.getStart();
        Point end = request.getEnd();

        PriorityQueue<Node> pq = new PriorityQueue<>();
        Map<Point, Double> distances = new HashMap<>();
        Map<Point, Point> parent = new HashMap<>();
        Set<Point> visited = new HashSet<>();
        List<Point> visitedPath = new ArrayList<>();

        pq.offer(new Node(start, 0.0));
        distances.put(start, 0.0);
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
                List<Point> path = PathUtils.reconstructPath(parent, end);
                return new PathfindingResponse(path, visitedPath, nodesExplored, 0, true, getAlgorithmName());
            }

            for (Point neighbor : grid.getNeighbors(currentPoint, visited)) {
                double movementCost = grid.getMovementCost(currentPoint, neighbor);
                double newDistance = distances.get(currentPoint) + movementCost;

                if (!distances.containsKey(neighbor) || newDistance < distances.get(neighbor)) {
                    distances.put(neighbor, newDistance);
                    parent.put(neighbor, currentPoint);
                    pq.offer(new Node(neighbor, newDistance));
                }
            }
        }

        return new PathfindingResponse(new ArrayList<>(), visitedPath, nodesExplored, 0, false, getAlgorithmName());
    }

    @Override
    public String getAlgorithmName() {
        return "DIJKSTRA";
    }
}
