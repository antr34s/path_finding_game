package com.algofind.service;

import com.algofind.dto.PathfindingRequest;
import com.algofind.dto.PathfindingResponse;

public interface PathfindingService {
    PathfindingResponse execute(PathfindingRequest request);
    String getAlgorithmName();
}
