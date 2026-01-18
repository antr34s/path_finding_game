package com.algofind;

import com.algofind.service.PathfindingService;
import com.algofind.service.PathfindingServiceFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api")
public class AlgorithmController {

    @Autowired
    private PathfindingServiceFactory serviceFactory;

    @GetMapping("/helloworld")
    String getHelloWorld(){
       return "Hello World!";
    }

    @PostMapping("/pathfind")
    public ResponseEntity<PathfindingResponse> findPath(@RequestBody PathfindingRequest request) {
        try {
            long startTime = System.currentTimeMillis();

            PathfindingService service = serviceFactory.getService(request.getAlgorithm());
            PathfindingResponse response = service.execute(request);

            response.setExecutionTimeMs(System.currentTimeMillis() - startTime);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/algorithms")
    public ResponseEntity<String[]> getAvailableAlgorithms() {
        String[] algorithms = {"DFS", "BFS", "DIJKSTRA", "A_STAR"};
        return ResponseEntity.ok(algorithms);
    }
}
