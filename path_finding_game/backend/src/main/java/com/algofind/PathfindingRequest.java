package com.algofind;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
public class PathfindingRequest {
    public enum Algorithm {
        DFS,
        BFS,
        DIJKSTRA,
        A_STAR
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode(of = {"x", "y"})
    public static class Point {
        private int x;
        private int y;
        private double weight;

        public Point(int x, int y) {
            this.x = x;
            this.y = y;
            this.weight = 0.0;
        }
    }
    private int gridSize;
    private Point start;
    private Point end;
    private List<Point> barriers;
    private Algorithm algorithm;
    private boolean allowDiagonal;

}
