package com.algofind.util;

import com.algofind.PathfindingRequest.Point;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public final class PathUtils {

    private PathUtils() {}

    public static List<Point> reconstructPath(Map<Point, Point> parents, Point end) {
        List<Point> path = new ArrayList<>();
        Point current = end;

        while (current != null) {
            path.add(0, current);
            current = parents.get(current);
        }

        return path;
    }
}
