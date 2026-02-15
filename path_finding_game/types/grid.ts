export type CellType =
  | 'empty'
  | 'start'
  | 'end'
  | 'obstacle'
  | 'visited'
  | 'path';

export interface Cell {
  row: number;
  col: number;
  type: CellType;
  weight: number;
  state?: 'visited' | 'path';
}