import { GridCoord, GridNode, NodeType, SearchResult } from '../types';

/**
 * Breadth-First Search (BFS)
 * Explores equally in all directions (FIFO Queue).
 * Guarantees fewest steps, but ignores terrain weights.
 */
export function runBFS(
  grid: GridNode[][],
  startCoord: GridCoord,
  endCoord: GridCoord
): SearchResult {
  const startTime = performance.now();
  const rows = grid.length;
  const cols = grid[0].length;

  // Clone grid nodes state
  const nodes: GridNode[][] = grid.map(row =>
    row.map(node => ({
      ...node,
      gScore: Infinity,
      isVisited: false,
      parent: null
    }))
  );

  const startNode = nodes[startCoord.r][startCoord.c];
  startNode.gScore = 0;
  startNode.isVisited = true;

  const queue: GridNode[] = [startNode];
  const visitedOrder: GridCoord[] = [];
  let found = false;

  // 4 directions: Up, Down, Left, Right
  const dirs = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 }
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    visitedOrder.push({ r: current.r, c: current.c });

    if (current.r === endCoord.r && current.c === endCoord.c) {
      found = true;
      break;
    }

    for (const d of dirs) {
      const nr = current.r + d.r;
      const nc = current.c + d.c;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const neighbor = nodes[nr][nc];

        if (!neighbor.isVisited && neighbor.type !== NodeType.WALL) {
          neighbor.isVisited = true;
          neighbor.parent = current;
          neighbor.gScore = current.gScore + neighbor.cost;
          queue.push(neighbor);
        }
      }
    }
  }

  // Reconstruct path
  const shortestPath: GridCoord[] = [];
  let totalCost = 0;

  if (found) {
    let curr: GridNode | null = nodes[endCoord.r][endCoord.c];
    while (curr) {
      shortestPath.unshift({ r: curr.r, c: curr.c });
      totalCost += curr.cost;
      curr = curr.parent;
    }
  }

  const executionTimeMs = performance.now() - startTime;

  return {
    algorithm: 'bfs',
    visitedOrder,
    shortestPath,
    metrics: {
      algorithm: 'bfs',
      name: 'BFS (Breadth-First Search)',
      executionTimeMs,
      visitedNodesCount: visitedOrder.length,
      pathLength: shortestPath.length,
      pathCost: totalCost,
      found
    }
  };
}
