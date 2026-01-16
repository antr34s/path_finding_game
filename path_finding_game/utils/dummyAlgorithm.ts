export function dummyAlgorithm(start: any, end: any) {
  const visited = [];
  const path = [];

  // fake visited cells
  for (let i = 0; i < 15; i++) {
    visited.push({ row: i, col: i });
  }

  // fake final path
  for (let i = 15; i < 25; i++) {
    path.push({ row: i, col: i });
  }

  return { visited, path };
}