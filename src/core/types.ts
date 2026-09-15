/**
 * Core type definitions for PathQuest 2D/3D
 */

export enum NodeType {
  EMPTY = 'empty',
  WALL = 'wall',
  START = 'start',
  END = 'end',
  MUD = 'mud',       // Weight = 5
  WATER = 'water'    // Weight = 10
}

export const NODE_COSTS: Record<NodeType, number> = {
  [NodeType.EMPTY]: 1,
  [NodeType.WALL]: Infinity,
  [NodeType.START]: 1,
  [NodeType.END]: 1,
  [NodeType.MUD]: 5,
  [NodeType.WATER]: 10
};

export interface GridCoord {
  r: number;
  c: number;
}

export interface GridNode {
  r: number;
  c: number;
  type: NodeType;
  cost: number;
  // Algorithm calculation fields
  gScore: number;
  fScore: number;
  hScore: number;
  isVisited: boolean;
  parent: GridNode | null;
}

export type AlgorithmType = 'bfs' | 'dijkstra' | 'astar';

export interface AlgorithmMetrics {
  algorithm: AlgorithmType;
  name: string;
  executionTimeMs: number;
  visitedNodesCount: number;
  pathLength: number;
  pathCost: number;
  found: boolean;
}

export interface SearchResult {
  algorithm: AlgorithmType;
  visitedOrder: GridCoord[];
  shortestPath: GridCoord[];
  metrics: AlgorithmMetrics;
}

export type BrushMode = 'start' | 'end' | 'wall' | 'mud' | 'water' | 'eraser';

export type ViewMode = '3d-iso' | '2d-top';

export type AppMode = 'lab' | 'arcade';
