package com.algofind.model;

import com.algofind.PathfindingRequest;
import com.algofind.PathfindingRequest.Point;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class GridGraph {

    private static final int[][] DIRECTIONS_4 = {
        {0, 1}, {1, 0}, {0, -1}, {-1, 0}
    };
    private static final int[][] DIRECTIONS_8 = {
        {0, 1}, {1, 0}, {0, -1}, {-1, 0},
        {1, 1}, {1, -1}, {-1, 1}, {-1, -1}
    };
    private static final double SQRT2 = Math.sqrt(2);

    private final int gridSize;
    private final boolean allowDiagonal;
    private final Map<Point, Double> barriers;

    public GridGraph(int gridSize, List<Point> barrierList, boolean allowDiagonal) {
        this.gridSize = gridSize;
        this.allowDiagonal = allowDiagonal;
        this.barriers = new HashMap<>();
        if (barrierList != null) {
            for (Point barrier : barrierList) {
                this.barriers.put(barrier, barrier.getWeight());
            }
        }
    }

    public static GridGraph from(PathfindingRequest request) {
        return new GridGraph(
            request.getGridSize(),
            request.getBarriers(),
            request.isAllowDiagonal()
        );
    }

    public List<Point> getNeighbors(Point current, Set<Point> excluded) {
        List<Point> neighbors = new ArrayList<>();
        int[][] directions = allowDiagonal ? DIRECTIONS_8 : DIRECTIONS_4;

        for (int[] direction : directions) {
            int newX = current.getX() + direction[0];
            int newY = current.getY() + direction[1];

            if (!isInBounds(newX, newY)) {
                continue;
            }

            Point neighbor = new Point(newX, newY);

            if (isImpassable(neighbor)) {
                continue;
            }

            if (excluded != null && excluded.contains(neighbor)) {
                continue;
            }

            neighbors.add(neighbor);
        }

        return neighbors;
    }

    public double getMovementCost(Point from, Point to) {
        double baseCost = isDiagonalMove(from, to) ? SQRT2 : 1.0;

        Double weight = barriers.get(to);
        if (weight != null && weight > 0) {
            baseCost += weight;
        }

        return baseCost;
    }

    public int getGridSize() {
        return gridSize;
    }

    public boolean isAllowDiagonal() {
        return allowDiagonal;
    }

    private boolean isInBounds(int x, int y) {
        return x >= 0 && x < gridSize && y >= 0 && y < gridSize;
    }

    private boolean isImpassable(Point p) {
        Double weight = barriers.get(p);
        return weight != null && weight <= 0;
    }

    private boolean isDiagonalMove(Point from, Point to) {
        return from.getX() != to.getX() && from.getY() != to.getY();
    }
}
