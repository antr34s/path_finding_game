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
public class BFSService implements PathfindingService {

    private final Random random = new Random();

    @Override
    public PathfindingResponse execute(PathfindingRequest request) {
        GridGraph grid = GridGraph.from(request);
        Point start = request.getStart();
        Point end = request.getEnd();

        Queue<Point> queue = new LinkedList<>();
        Map<Point, Point> parent = new HashMap<>();
        Set<Point> visited = new HashSet<>();
        List<Point> visitedPath = new ArrayList<>();

        queue.offer(start);
        visited.add(start);
        visitedPath.add(start);
        parent.put(start, null);

        int nodesExplored = 0;

        while (!queue.isEmpty()) {
            Point current = queue.poll();
            nodesExplored++;

            if (current.equals(end)) {
                List<Point> path = PathUtils.reconstructPath(parent, end);
                return new PathfindingResponse(path, visitedPath, nodesExplored, 0, true, getAlgorithmName());
            }

            List<Point> neighbors = grid.getNeighbors(current, visited);
            Collections.shuffle(neighbors, random);

            for (Point neighbor : neighbors) {
                queue.offer(neighbor);
                visited.add(neighbor);
                visitedPath.add(neighbor);
                parent.put(neighbor, current);
            }
        }

        return new PathfindingResponse(new ArrayList<>(), visitedPath, nodesExplored, 0, false, getAlgorithmName());
    }

    @Override
    public String getAlgorithmName() {
        return "BFS";
    }
}
