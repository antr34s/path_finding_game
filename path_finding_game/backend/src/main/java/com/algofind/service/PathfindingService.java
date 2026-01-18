package com.algofind.service;

import com.algofind.PathfindingRequest;
import com.algofind.PathfindingResponse;

public interface PathfindingService {
    PathfindingResponse execute(PathfindingRequest request);
    String getAlgorithmName();
}
