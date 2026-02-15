import { useState, useEffect } from 'react';
import { Cell } from '../types/grid';
import { RunStats } from '../types/stats';
import { fetchPathfinding, PathfindingApiRequest } from '../services/api';
import { GRID_SIZE } from '../utils/createGrid';

interface UsePathfindingParams {
  grid: Cell[][];
  setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>;
  speed: number;
  algorithm: string;
  startSet: boolean;
  endSet: boolean;
  buildRequest: () => PathfindingApiRequest;
}

export function usePathfinding({
  grid,
  setGrid,
  speed,
  algorithm,
  startSet,
  endSet,
  buildRequest,
}: UsePathfindingParams) {
  const [isRunning, setIsRunning] = useState(false);
  const [runCompleted, setRunCompleted] = useState(false);
  const [instruction, setInstruction] = useState('Place the starting node');
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<RunStats>({
    algorithm: 'A*',
    visitedNodes: 0,
    pathLength: 0,
    pathWeight: 0,
    gridSize: `${GRID_SIZE} x ${GRID_SIZE}`,
  });

  useEffect(() => {
    if (isRunning) {
      setInstruction('Visualizing algorithm...');
      return;
    }

    if (runCompleted) {
      setInstruction(
        'Press RESET to remove the visited cells or CLEAR to empty the grid'
      );
      return;
    }

    if (!startSet) {
      setInstruction('Click where you want to place the starting point');
    } else if (!endSet) {
      setInstruction('Click where you want to place the ending point');
    } else {
      setInstruction(
        "Choose the obstacles' cost on the right side and click to place them or press PLAY"
      );
    }
  }, [startSet, endSet, isRunning, runCompleted]);

  const getBatchSize = () => {
    if (speed < 20) return 1;
    if (speed < 40) return 2;
    if (speed < 60) return 4;
    if (speed < 80) return 10;
    if (speed < 95) return 15;
    return 20;
  };

  const animateVisited = async (visited: { x: number; y: number }[]) => {
    const batchSize = getBatchSize();

    for (let i = 0; i < visited.length; i += batchSize) {
      const batch = visited.slice(i, i + batchSize);

      setGrid(prev =>
        prev.map(row =>
          row.map(cell => {
            if (cell.type === 'start' || cell.type === 'end') return cell;

            const hit = batch.find(
              p => p.x === cell.row && p.y === cell.col
            );

            if (hit) return { ...cell, state: 'visited' as const };
            return cell;
          })
        )
      );

      await new Promise(res => requestAnimationFrame(res));
    }
  };

  const animatePath = async (path: { x: number; y: number }[]) => {
    const batchSize = getBatchSize();

    for (let i = 0; i < path.length; i += batchSize) {
      const batch = path.slice(i, i + batchSize);

      setGrid(prev =>
        prev.map(row =>
          row.map(cell => {
            if (cell.type === 'start' || cell.type === 'end') return cell;

            const hit = batch.find(
              p => p.x === cell.row && p.y === cell.col
            );

            if (hit) return { ...cell, state: 'path' as const };
            return cell;
          })
        )
      );

      await new Promise(res => requestAnimationFrame(res));
    }
  };

  const runAlgorithm = async () => {
    if (isRunning) return;
    if (!startSet || !endSet) return;

    setIsRunning(true);

    try {
      const data = await fetchPathfinding(buildRequest());

      await animateVisited(data.visitedPath);
      await animatePath(data.path);

      setRunCompleted(true);
      setInstruction(
        'Press RESET to remove the visited cells or CLEAR to empty the grid'
      );
      setIsRunning(false);

      await new Promise(res => setTimeout(res, 1500));

      const rawVisited = data.visitedPath.length;
      const rawPath = data.path.length;
      const adjustedVisited = Math.max(0, rawVisited - 2);
      const adjustedPathLength = rawPath === 0 ? 0 : Math.max(1, rawPath - 1);

      let calculatedCost = -1;
      data.path.forEach((node: any) => {
        const cell = grid[node.x]?.[node.y];
        calculatedCost += cell?.weight ?? 1;
      });

      if (rawPath === 0) {
        setStats({
          algorithm,
          visitedNodes: adjustedVisited,
          pathLength: 'No path found',
          pathWeight: 'No path found',
          gridSize: `${GRID_SIZE} x ${GRID_SIZE}`,
        });
      } else {
        setStats({
          algorithm,
          visitedNodes: adjustedVisited,
          pathLength: adjustedPathLength,
          pathWeight: calculatedCost,
          gridSize: `${GRID_SIZE} x ${GRID_SIZE}`,
        });
      }

      setShowStats(true);
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        setInstruction('Request timed out. Please try again.');
      } else {
        setInstruction(error?.message ?? 'Error running algorithm');
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunOrReset = (resetPath: () => void) => {
    if (runCompleted) {
      setRunCompleted(false);
      resetPath();
    } else {
      runAlgorithm();
    }
  };

  const reset = () => {
    setIsRunning(false);
    setRunCompleted(false);
  };

  return {
    isRunning,
    runCompleted,
    instruction,
    stats,
    showStats,
    setShowStats,
    handleRunOrReset,
    reset,
  };
}
