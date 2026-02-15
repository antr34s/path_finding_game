import { useEffect, useState } from 'react';
import { createGrid, GRID_SIZE } from '../utils/createGrid';
import { Cell, CellType } from '../types/grid';
import { PathfindingApiRequest } from '../services/api';

export function useGrid(algorithm: string, allowDiagonal: boolean, selectedWeight: number) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [startSet, setStartSet] = useState(false);
  const [endSet, setEndSet] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  useEffect(() => {
    setGrid(createGrid());
  }, []);

  const updateCell = (cell: Cell, newType: CellType) => {
    setGrid(prev =>
      prev.map(row =>
        row.map(c =>
          c.row === cell.row && c.col === cell.col
            ? { ...c, type: newType, weight: cell.weight ?? c.weight }
            : c
        )
      )
    );
  };

  const handleCellPress = (cell: Cell, isRunning: boolean) => {
    if (isRunning) return;

    if (!startSet) {
      updateCell(cell, 'start');
      setStartSet(true);
      return;
    }

    if (!endSet) {
      updateCell(cell, 'end');
      setEndSet(true);
      return;
    }

    if (cell.type === 'empty') {
      updateCell({ ...cell, weight: selectedWeight }, 'obstacle');
      return;
    }

    if (cell.type === 'obstacle' && !isPressing) {
      updateCell({ ...cell, weight: 1 }, 'empty');
    }
  };

  const resetGrid = () => {
    setStartSet(false);
    setEndSet(false);
    setGrid(createGrid());
  };

  const resetPath = () => {
    setGrid(prev =>
      prev.map(row =>
        row.map(cell => ({
          ...cell,
          state: undefined,
        }))
      )
    );
  };

  const buildRequest = (): PathfindingApiRequest => {
    let start = null;
    let end = null;
    const barriers: { x: number; y: number; weight: number }[] = [];

    grid.forEach(row =>
      row.forEach(cell => {
        if (cell.type === 'start') {
          start = { x: cell.row, y: cell.col };
        }
        if (cell.type === 'end') {
          end = { x: cell.row, y: cell.col };
        }
        if (cell.type === 'obstacle') {
          barriers.push({
            x: cell.row,
            y: cell.col,
            weight: cell.weight === Infinity ? -1 : cell.weight,
          });
        }
      })
    );

    return {
      gridSize: GRID_SIZE,
      start,
      end,
      barriers,
      algorithm: algorithm === 'A*' ? 'A_STAR' : algorithm,
      allowDiagonal,
    };
  };

  return {
    grid,
    setGrid,
    startSet,
    endSet,
    isPressing,
    setIsPressing,
    handleCellPress,
    resetGrid,
    resetPath,
    buildRequest,
  };
}
