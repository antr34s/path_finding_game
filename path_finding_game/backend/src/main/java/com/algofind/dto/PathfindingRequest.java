package com.algofind.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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
    @Min(2)
    @Max(100)
    private int gridSize;

    @NotNull
    @Valid
    private Point start;

    @NotNull
    @Valid
    private Point end;

    private List<Point> barriers;

    @NotNull
    private Algorithm algorithm;

    private boolean allowDiagonal;

}
