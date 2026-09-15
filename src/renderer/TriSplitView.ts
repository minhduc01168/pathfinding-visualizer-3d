import { runAStar } from '../core/algorithms/astar';
import { runBFS } from '../core/algorithms/bfs';
import { runDijkstra } from '../core/algorithms/dijkstra';
import { GridCoord, GridNode, NODE_COSTS, NodeType, SearchResult } from '../core/types';
import { GridCanvas2D } from './GridCanvas2D';

export interface TriSplitCallbacks {
  onProgress?: (progress: { bfsPct: number; dijkstraPct: number; astarPct: number }) => void;
  onComplete?: (results: Map<string, SearchResult>) => void;
}

/**
 * Manages 3 Synchronized Side-by-Side Visualizers (BFS vs Dijkstra vs A*)
 * and preserves visited wavefront traces and golden path trails.
 */
export class TriSplitView {
  private bfsCanvas: GridCanvas2D;
  private dijkstraCanvas: GridCanvas2D;
  private astarCanvas: GridCanvas2D;

  private isRunning: boolean = false;
  private animTimer: number | null = null;

  constructor(
    canvasBfsEl: HTMLCanvasElement,
    canvasDijkstraEl: HTMLCanvasElement,
    canvasAstarEl: HTMLCanvasElement
  ) {
    this.bfsCanvas = new GridCanvas2D(canvasBfsEl, { interactive: false });
    this.dijkstraCanvas = new GridCanvas2D(canvasDijkstraEl, { interactive: false });
    this.astarCanvas = new GridCanvas2D(canvasAstarEl, { interactive: false });
  }

  public init(rows: number, cols: number): void {
    this.bfsCanvas.init(rows, cols);
    this.dijkstraCanvas.init(rows, cols);
    this.astarCanvas.init(rows, cols);
  }

  public resize(): void {
    this.bfsCanvas.resize();
    this.dijkstraCanvas.resize();
    this.astarCanvas.resize();
  }

  public renderAll(grid: NodeType[][], start: GridCoord, end: GridCoord): void {
    this.bfsCanvas.render(grid, start, end);
    this.dijkstraCanvas.render(grid, start, end);
    this.astarCanvas.render(grid, start, end);
  }

  public clearAllTraces(grid: NodeType[][], start: GridCoord, end: GridCoord): void {
    this.stopSimulation();
    this.bfsCanvas.clearTraces();
    this.dijkstraCanvas.clearTraces();
    this.astarCanvas.clearTraces();
    this.renderAll(grid, start, end);
  }

  public stopSimulation(): void {
    if (this.animTimer !== null) {
      clearInterval(this.animTimer);
      this.animTimer = null;
    }
    this.isRunning = false;
  }

  /**
   * Runs all 3 algorithms simultaneously in synchronized lockstep,
   * animating their expanding wavefronts and displaying the persistent traces.
   */
  public startRace(
    grid: NodeType[][],
    start: GridCoord,
    end: GridCoord,
    speedMultiplier: number = 2,
    callbacks?: TriSplitCallbacks
  ): Promise<Map<string, SearchResult>> {
    this.clearAllTraces(grid, start, end);
    this.isRunning = true;

    // Convert NodeType[][] to GridNode[][]
    const rows = grid.length;
    const cols = grid[0].length;
    const searchGrid: GridNode[][] = [];

    for (let r = 0; r < rows; r++) {
      const row: GridNode[] = [];
      for (let c = 0; c < cols; c++) {
        const type = grid[r][c];
        row.push({
          r,
          c,
          type,
          cost: NODE_COSTS[type],
          gScore: Infinity,
          fScore: Infinity,
          hScore: 0,
          isVisited: false,
          parent: null
        });
      }
      searchGrid.push(row);
    }

    // Execute algorithms synchronously to calculate visited order and path
    const bfsResult = runBFS(searchGrid, start, end);
    const dijkstraResult = runDijkstra(searchGrid, start, end);
    const astarResult = runAStar(searchGrid, start, end);

    const resultMap = new Map<string, SearchResult>();
    resultMap.set('bfs', bfsResult);
    resultMap.set('dijkstra', dijkstraResult);
    resultMap.set('astar', astarResult);

    if (speedMultiplier >= 999) {
      // Instant execution: render all traces immediately
      for (const p of bfsResult.visitedOrder) this.bfsCanvas.markVisited(p.r, p.c);
      this.bfsCanvas.setShortestPath(bfsResult.shortestPath);

      for (const p of dijkstraResult.visitedOrder) this.dijkstraCanvas.markVisited(p.r, p.c);
      this.dijkstraCanvas.setShortestPath(dijkstraResult.shortestPath);

      for (const p of astarResult.visitedOrder) this.astarCanvas.markVisited(p.r, p.c);
      this.astarCanvas.setShortestPath(astarResult.shortestPath);

      this.renderAll(grid, start, end);
      this.isRunning = false;
      if (callbacks?.onComplete) callbacks.onComplete(resultMap);
      return Promise.resolve(resultMap);
    }

    return new Promise((resolve) => {
      let stepIdx = 0;
      const maxSteps = Math.max(
        bfsResult.visitedOrder.length,
        dijkstraResult.visitedOrder.length,
        astarResult.visitedOrder.length
      );

      // Adjust interval and batch size based on speed
      const batchSize = Math.max(1, Math.floor(speedMultiplier * 2));
      const intervalMs = Math.max(16, Math.floor(40 / speedMultiplier));

      this.animTimer = window.setInterval(() => {
        if (!this.isRunning) {
          clearInterval(this.animTimer!);
          this.animTimer = null;
          return;
        }

        for (let b = 0; b < batchSize; b++) {
          const i = stepIdx + b;

          if (i < bfsResult.visitedOrder.length) {
            const p = bfsResult.visitedOrder[i];
            this.bfsCanvas.markVisited(p.r, p.c);
          } else if (i === bfsResult.visitedOrder.length) {
            this.bfsCanvas.setShortestPath(bfsResult.shortestPath);
          }

          if (i < dijkstraResult.visitedOrder.length) {
            const p = dijkstraResult.visitedOrder[i];
            this.dijkstraCanvas.markVisited(p.r, p.c);
          } else if (i === dijkstraResult.visitedOrder.length) {
            this.dijkstraCanvas.setShortestPath(dijkstraResult.shortestPath);
          }

          if (i < astarResult.visitedOrder.length) {
            const p = astarResult.visitedOrder[i];
            this.astarCanvas.markVisited(p.r, p.c);
          } else if (i === astarResult.visitedOrder.length) {
            this.astarCanvas.setShortestPath(astarResult.shortestPath);
          }
        }

        stepIdx += batchSize;
        this.renderAll(grid, start, end);

        if (callbacks?.onProgress) {
          callbacks.onProgress({
            bfsPct: Math.min(100, (stepIdx / bfsResult.visitedOrder.length) * 100),
            dijkstraPct: Math.min(100, (stepIdx / dijkstraResult.visitedOrder.length) * 100),
            astarPct: Math.min(100, (stepIdx / astarResult.visitedOrder.length) * 100)
          });
        }

        if (stepIdx >= maxSteps) {
          clearInterval(this.animTimer!);
          this.animTimer = null;
          this.isRunning = false;

          // Ensure final shortest paths are set
          this.bfsCanvas.setShortestPath(bfsResult.shortestPath);
          this.dijkstraCanvas.setShortestPath(dijkstraResult.shortestPath);
          this.astarCanvas.setShortestPath(astarResult.shortestPath);
          this.renderAll(grid, start, end);

          if (callbacks?.onComplete) callbacks.onComplete(resultMap);
          resolve(resultMap);
        }
      }, intervalMs);
    });
  }
}
