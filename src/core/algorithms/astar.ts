import { manhattanDistance } from '../heuristics';
import { MinHeap } from '../MinHeap';
import { GridCoord, GridNode, NodeType, SearchResult } from '../types';

/**
 * A* Search Algorithm
 * Combines exact path cost g(n) with heuristic h(n) to guide search directly towards goal.
 * Minimizes visited nodes while guaranteeing optimal path with admissible heuristic.
 */
export function runAStar(
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
      fScore: Infinity,
      hScore: 0,
      isVisited: false,
      parent: null
    }))
  );

  const startNode = nodes[startCoord.r][startCoord.c];
  startNode.gScore = 0;
  startNode.hScore = manhattanDistance(startCoord, endCoord);
  startNode.fScore = startNode.hScore;

  const heap = new MinHeap<GridNode>();
  heap.push(startNode, startNode.fScore);

  const visitedOrder: GridCoord[] = [];
  let found = false;

  const dirs = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 }
  ];

  while (!heap.isEmpty()) {
    const current = heap.pop()!;

    if (current.isVisited) continue;
    current.isVisited = true;
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
          const tentativeG = current.gScore + neighbor.cost;

          if (tentativeG < neighbor.gScore) {
            neighbor.gScore = tentativeG;
            neighbor.hScore = manhattanDistance({ r: nr, c: nc }, endCoord);
            neighbor.fScore = neighbor.gScore + neighbor.hScore;
            neighbor.parent = current;
            heap.push(neighbor, neighbor.fScore);
          }
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
    algorithm: 'astar',
    visitedOrder,
    shortestPath,
    metrics: {
      algorithm: 'astar',
      name: 'Thuật toán A*',
      executionTimeMs,
      visitedNodesCount: visitedOrder.length,
      pathLength: shortestPath.length,
      pathCost: totalCost,
      found
    }
  };
}
