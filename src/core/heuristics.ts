import { GridCoord } from './types';

/**
 * Heuristics for Grid-based Pathfinding
 */

export function manhattanDistance(a: GridCoord, b: GridCoord): number {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

export function euclideanDistance(a: GridCoord, b: GridCoord): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.c - b.c) ** 2);
}

export function chebyshevDistance(a: GridCoord, b: GridCoord): number {
  return Math.max(Math.abs(a.r - b.r), Math.abs(a.c - b.c));
}
