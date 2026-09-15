import { GridCoord, NodeType } from '../types';

/**
 * Maze and Terrain Pattern Generators
 */

export function createEmptyGrid(rows: number, cols: number): NodeType[][] {
  const grid: NodeType[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: NodeType[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(NodeType.EMPTY);
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Generates random walls and patches of mud/water.
 */
export function generateRandomTerrain(
  rows: number,
  cols: number,
  start: GridCoord,
  end: GridCoord,
  wallDensity: number = 0.25,
  mudDensity: number = 0.15,
  waterDensity: number = 0.08
): NodeType[][] {
  const grid = createEmptyGrid(rows, cols);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Preserve start and end cells + their direct surroundings
      if (
        (Math.abs(r - start.r) <= 1 && Math.abs(c - start.c) <= 1) ||
        (Math.abs(r - end.r) <= 1 && Math.abs(c - end.c) <= 1)
      ) {
        continue;
      }

      const rand = Math.random();
      if (rand < wallDensity) {
        grid[r][c] = NodeType.WALL;
      } else if (rand < wallDensity + mudDensity) {
        grid[r][c] = NodeType.MUD;
      } else if (rand < wallDensity + mudDensity + waterDensity) {
        grid[r][c] = NodeType.WATER;
      }
    }
  }

  return grid;
}

/**
 * Recursive Backtracking Maze Generator.
 * Generates rich corridors and paths.
 */
export function generateRecursiveBacktracking(
  rows: number,
  cols: number,
  start: GridCoord,
  end: GridCoord
): NodeType[][] {
  // Start with all walls
  const grid: NodeType[][] = [];
  for (let r = 0; r < rows; r++) {
    grid.push(new Array(cols).fill(NodeType.WALL));
  }

  // Ensure odd row/col for passages
  const startR = start.r % 2 === 1 ? start.r : Math.max(1, start.r - 1);
  const startC = start.c % 2 === 1 ? start.c : Math.max(1, start.c - 1);

  const stack: [number, number][] = [[startR, startC]];
  grid[startR][startC] = NodeType.EMPTY;

  const dirs = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2]
  ];

  while (stack.length > 0) {
    const [currR, currC] = stack[stack.length - 1];
    const neighbors: [number, number, number, number][] = [];

    // Shuffle directions
    const shuffledDirs = [...dirs].sort(() => Math.random() - 0.5);

    for (const [dr, dc] of shuffledDirs) {
      const nr = currR + dr;
      const nc = currC + dc;

      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && grid[nr][nc] === NodeType.WALL) {
        neighbors.push([nr, nc, currR + dr / 2, currC + dc / 2]);
      }
    }

    if (neighbors.length > 0) {
      const [nextR, nextC, wallR, wallC] = neighbors[0];
      grid[wallR][wallC] = NodeType.EMPTY;
      grid[nextR][nextC] = NodeType.EMPTY;
      stack.push([nextR, nextC]);
    } else {
      stack.pop();
    }
  }

  // Ensure start and end points and immediate pathways are clear
  grid[start.r][start.c] = NodeType.EMPTY;
  grid[end.r][end.c] = NodeType.EMPTY;

  // Add random mud or water patches along open paths to test Dijkstra
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === NodeType.EMPTY && Math.random() < 0.12) {
        grid[r][c] = Math.random() > 0.4 ? NodeType.MUD : NodeType.WATER;
      }
    }
  }

  // Open direct neighbors around start and end
  for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
    const sr = start.r + dr;
    const sc = start.c + dc;
    if (sr >= 0 && sr < rows && sc >= 0 && sc < cols) grid[sr][sc] = NodeType.EMPTY;

    const er = end.r + dr;
    const ec = end.c + dc;
    if (er >= 0 && er < rows && ec >= 0 && ec < cols) grid[er][ec] = NodeType.EMPTY;
  }

  return grid;
}

/**
 * Creates a Trap / River challenge specifically highlighting Dijkstra & A* vs BFS.
 * Direct path is filled with heavy Mud (cost 5) or Water (cost 10),
 * while a bypass path is completely clear (cost 1).
 */
export function generateWeightTrapChallenge(
  rows: number,
  cols: number,
  start: GridCoord,
  end: GridCoord
): NodeType[][] {
  const grid = createEmptyGrid(rows, cols);

  const midCol = Math.floor((start.c + end.c) / 2);

  // Create a vertical wall barrier with a central muddy passage and clear bypasses at top/bottom
  for (let r = 0; r < rows; r++) {
    for (let c = midCol - 2; c <= midCol + 2; c++) {
      if (c >= 0 && c < cols) {
        if (r >= Math.floor(rows * 0.25) && r <= Math.floor(rows * 0.75)) {
          // Thick Mud Swamp in the center
          grid[r][c] = NodeType.MUD;
        } else if (r === 0 || r === rows - 1) {
          // Clear detour around the swamp
          grid[r][c] = NodeType.EMPTY;
        }
      }
    }
  }

  // Clear start and end
  grid[start.r][start.c] = NodeType.EMPTY;
  grid[end.r][end.c] = NodeType.EMPTY;

  return grid;
}
