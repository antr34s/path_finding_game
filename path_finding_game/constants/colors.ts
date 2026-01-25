import { CellType } from '../types/grid';

export const CELL_COLORS: Record<CellType, string> = {
  empty: '#05010a',
  start: '#00ffd5',
  end: '#ff006e',
  obstacle: '#e6e6e6',
  visited: '#3b8cff',
  path: '#fff200',
};