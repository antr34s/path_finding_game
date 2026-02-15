package com.algofind.service;

import com.algofind.dto.PathfindingRequest;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class PathfindingServiceFactory {

    private final Map<PathfindingRequest.Algorithm, PathfindingService> services;

    public PathfindingServiceFactory(List<PathfindingService> serviceList) {
        this.services = new HashMap<>();
        for (PathfindingService service : serviceList) {
            PathfindingRequest.Algorithm algorithm = mapServiceToAlgorithm(service);
            if (algorithm != null) {
                services.put(algorithm, service);
            }
        }
    }

    public PathfindingService getService(PathfindingRequest.Algorithm algorithm) {
        PathfindingService service = services.get(algorithm);
        if (service == null) {
            throw new IllegalArgumentException("No service found for algorithm: " + algorithm);
        }
        return service;
    }

    private PathfindingRequest.Algorithm mapServiceToAlgorithm(PathfindingService service) {
        switch (service.getAlgorithmName()) {
            case "DFS":
                return PathfindingRequest.Algorithm.DFS;
            case "BFS":
                return PathfindingRequest.Algorithm.BFS;
            case "DIJKSTRA":
                return PathfindingRequest.Algorithm.DIJKSTRA;
            case "A_STAR":
                return PathfindingRequest.Algorithm.A_STAR;
            default:
                return null;
        }
    }
}
