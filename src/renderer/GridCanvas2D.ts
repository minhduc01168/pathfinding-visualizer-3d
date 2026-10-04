import { GridCoord, NodeType } from '../core/types';

export interface GridCanvasOptions {
  interactive?: boolean;
  onCellClick?: (r: number, c: number) => void;
  onCellDrag?: (r: number, c: number) => void;
}

/**
 * High-performance HTML5 Canvas Renderer with Rich Visual Storytelling,
 * Procedural Textures (Bricks, Mud Bubbles, Water Waves), and Radiant Beacons.
 */
export class GridCanvas2D {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rows: number = 0;
  private cols: number = 0;
  private cellSize: number = 24;
  private isMouseDown: boolean = false;
  private options: GridCanvasOptions;

  // Visual trace states
  private visitedSet: Set<string> = new Set();
  private visitedOrderArray: GridCoord[] = [];
  private pathSet: Set<string> = new Set();

  constructor(canvas: HTMLCanvasElement, options: GridCanvasOptions = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.options = options;

    if (options.interactive) {
      this.attachEvents();
    }
  }

  public init(rows: number, cols: number): void {
    this.rows = rows;
    this.cols = cols;
    this.resize();
    this.clearTraces();
  }

  public resize(): void {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;
    if (width === 0 || height === 0) return;

    const cellW = width / this.cols;
    const cellH = height / this.rows;
    this.cellSize = Math.min(cellW, cellH);

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.cols * this.cellSize * dpr;
    this.canvas.height = this.rows * this.cellSize * dpr;
    this.canvas.style.width = `${this.cols * this.cellSize}px`;
    this.canvas.style.height = `${this.rows * this.cellSize}px`;

    this.ctx.scale(dpr, dpr);
  }

  public clearTraces(): void {
    this.visitedSet.clear();
    this.visitedOrderArray = [];
    this.pathSet.clear();
  }

  public markVisited(r: number, c: number): void {
    const key = `${r},${c}`;
    if (!this.visitedSet.has(key)) {
      this.visitedSet.add(key);
      this.visitedOrderArray.push({ r, c });
    }
  }

  public setShortestPath(path: GridCoord[]): void {
    this.pathSet.clear();
    for (const p of path) {
      this.pathSet.add(`${p.r},${p.c}`);
    }
  }

  private isLightTheme(): boolean {
    return !document.body.classList.contains('dark-theme');
  }

  public render(
    grid: NodeType[][],
    start: GridCoord,
    end: GridCoord
  ): void {
    const ctx = this.ctx;
    const cs = this.cellSize;
    const isLight = this.isLightTheme();

    const palette = isLight
      ? {
          bg: '#ffffff',
          gridLine: 'rgba(203, 213, 225, 0.75)',
          empty: '#ffffff',
          visited: 'rgba(99, 102, 241, 0.28)',
          visitedBorder: 'rgba(99, 102, 241, 0.75)',
          path: '#d97706',
          pathGlow: 'rgba(217, 119, 6, 0.6)'
        }
      : {
          bg: '#0a0e1a',
          gridLine: 'rgba(255, 255, 255, 0.08)',
          empty: '#172033',
          visited: 'rgba(129, 140, 248, 0.38)',
          visitedBorder: 'rgba(129, 140, 248, 0.85)',
          path: '#fbbf24',
          pathGlow: 'rgba(251, 191, 36, 0.9)'
        };

    // Clear background
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, this.cols * cs, this.rows * cs);

    // Draw base cells and environmental textures
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = c * cs;
        const y = r * cs;
        const type = grid[r][c];
        const key = `${r},${c}`;

        // Don't render terrain under start/end (drawn on top layer)
        if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) {
          ctx.fillStyle = palette.empty;
          ctx.fillRect(x, y, cs, cs);
          continue;
        }

        if (type === NodeType.WALL) {
          this.renderFortifiedWall(ctx, x, y, cs, isLight);
          continue;
        } else if (type === NodeType.MUD) {
          this.renderViscousMud(ctx, x, y, cs, isLight);
        } else if (type === NodeType.WATER) {
          this.renderDeepWater(ctx, x, y, cs, isLight);
        } else {
          ctx.fillStyle = palette.empty;
          ctx.fillRect(x, y, cs, cs);
        }

        // Draw Visited Wavefront Trace
        if (this.visitedSet.has(key)) {
          ctx.fillStyle = palette.visited;
          ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
          ctx.strokeStyle = palette.visitedBorder;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 1.5, y + 1.5, cs - 3, cs - 3);
        }

        // Draw Shortest Path Trace (Luminous Gold)
        if (this.pathSet.has(key)) {
          ctx.fillStyle = palette.path;
          ctx.shadowColor = palette.pathGlow;
          ctx.shadowBlur = 12;
          ctx.fillRect(x + 2, y + 2, cs - 4, cs - 4);
          ctx.shadowBlur = 0; // Reset
        }

        // Grid border line
        ctx.strokeStyle = palette.gridLine;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cs, cs);
      }
    }

    // Draw START Beacon on top layer for maximum prominence
    this.renderStartBeacon(ctx, start.c * cs, start.r * cs, cs);

    // Draw END Portal on top layer for maximum prominence
    this.renderEndPortal(ctx, end.c * cs, end.r * cs, cs);
  }

  /**
   * Fortified Stone Brick Wall with 3D Bevel, Mortar Lines & Drop Shadow
   */
  private renderFortifiedWall(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cs: number,
    isLight: boolean
  ): void {
    const baseColor = isLight ? '#334155' : '#1e293b';
    const brickColor = isLight ? '#475569' : '#334155';
    const highlight = isLight ? '#94a3b8' : '#475569';
    const mortar = isLight ? '#1e293b' : '#0f172a';

    // Base background
    ctx.fillStyle = baseColor;
    ctx.fillRect(x, y, cs, cs);

    // Top & Left 3D Bevel highlight
    ctx.fillStyle = highlight;
    ctx.fillRect(x, y, cs, 2);
    ctx.fillRect(x, y, 2, cs);

    // Bottom & Right 3D Shadow
    ctx.fillStyle = mortar;
    ctx.fillRect(x, y + cs - 2, cs, 2);
    ctx.fillRect(x + cs - 2, y, 2, cs);

    // Procedural bricks pattern
    ctx.fillStyle = brickColor;
    const midY = y + Math.floor(cs / 2);
    ctx.fillRect(x + 2, y + 2, cs - 4, Math.floor(cs / 2) - 3);
    ctx.fillRect(x + 2, midY + 1, cs - 4, Math.floor(cs / 2) - 3);

    // Vertical mortar split lines
    ctx.fillStyle = mortar;
    ctx.fillRect(x, midY, cs, 2);
    ctx.fillRect(x + Math.floor(cs * 0.5), y + 2, 2, Math.floor(cs / 2) - 3);
    ctx.fillRect(x + Math.floor(cs * 0.25), midY + 1, 2, Math.floor(cs / 2) - 3);
    ctx.fillRect(x + Math.floor(cs * 0.75), midY + 1, 2, Math.floor(cs / 2) - 3);
  }

  /**
   * Viscous Sticky Mud with Bubbles, Swirl Texture & "×5" Cost Tag
   */
  private renderViscousMud(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cs: number,
    isLight: boolean
  ): void {
    const bg = isLight ? '#d97706' : '#92400e';
    const darkMud = isLight ? '#b45309' : '#78350f';
    const bubbleColor = isLight ? '#fbbf24' : '#f59e0b';

    ctx.fillStyle = bg;
    ctx.fillRect(x, y, cs, cs);

    // Viscous swirl patches
    ctx.fillStyle = darkMud;
    ctx.beginPath();
    ctx.arc(x + cs * 0.35, y + cs * 0.65, cs * 0.25, 0, Math.PI * 2);
    ctx.arc(x + cs * 0.75, y + cs * 0.35, cs * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Mud bubbles
    ctx.fillStyle = bubbleColor;
    ctx.beginPath();
    ctx.arc(x + cs * 0.35, y + cs * 0.35, Math.max(1.5, cs * 0.08), 0, Math.PI * 2);
    ctx.arc(x + cs * 0.68, y + cs * 0.68, Math.max(1, cs * 0.06), 0, Math.PI * 2);
    ctx.fill();

    // Prominent "×5" tag
    if (cs >= 18) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(8, Math.floor(cs * 0.32))}px monospace`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText('×5', x + cs - 2, y + 2);
    }
  }

  /**
   * Deep Water with Ripples, Concentric Waves & "×10" Cost Tag
   */
  private renderDeepWater(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cs: number,
    isLight: boolean
  ): void {
    const bg = isLight ? '#0284c7' : '#0369a1';
    const wave = isLight ? '#38bdf8' : '#0284c7';
    const deep = isLight ? '#0369a1' : '#075985';

    ctx.fillStyle = bg;
    ctx.fillRect(x, y, cs, cs);

    // Deep water current band
    ctx.fillStyle = deep;
    ctx.fillRect(x, y + cs * 0.45, cs, cs * 0.35);

    // Wave ripples
    ctx.strokeStyle = wave;
    ctx.lineWidth = Math.max(1, cs * 0.06);
    ctx.beginPath();
    ctx.arc(x + cs * 0.5, y + cs * 0.3, cs * 0.28, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + cs * 0.5, y + cs * 0.7, cs * 0.28, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Prominent "×10" tag
    if (cs >= 18) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(8, Math.floor(cs * 0.32))}px monospace`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText('×10', x + cs - 2, y + 2);
    }
  }

  /**
   * Radiant START Beacon (Emerald Glowing Aura + Holographic Pin + Rocket Glyph)
   */
  private renderStartBeacon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cs: number
  ): void {
    const cx = x + cs / 2;
    const cy = y + cs / 2;
    const r = (cs / 2) * 0.9;

    ctx.save();
    // Glowing Outer Halo
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 16;

    // Outer Concentric Ring
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
    ctx.stroke();

    // Radiant Emerald Disc
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
    grad.addColorStop(0, '#6ee7b7');
    grad.addColorStop(0.7, '#10b981');
    grad.addColorStop(1, '#047857');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Inner White Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Rocket / Play Symbol
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(11, Math.floor(cs * 0.58))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚀', cx, cy);
  }

  /**
   * Radiant END Portal (Crimson/Ruby Flaming Aura + Bullseye Target Glyph)
   */
  private renderEndPortal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cs: number
  ): void {
    const cx = x + cs / 2;
    const cy = y + cs / 2;
    const r = (cs / 2) * 0.9;

    ctx.save();
    // Glowing Outer Ruby Halo
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 18;

    // Outer Rotating Rings
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
    ctx.stroke();

    // Crimson Gradient Core
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
    grad.addColorStop(0, '#fca5a5');
    grad.addColorStop(0.6, '#ef4444');
    grad.addColorStop(1, '#991b1b');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Inner White Ring
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Target / Trophy Symbol
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(11, Math.floor(cs * 0.58))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎯', cx, cy);
  }

  private getCellFromMouse(e: MouseEvent): GridCoord | null {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const c = Math.floor(clientX / this.cellSize);
    const r = Math.floor(clientY / this.cellSize);

    if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
      return { r, c };
    }
    return null;
  }

  private attachEvents(): void {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      const coord = this.getCellFromMouse(e);
      if (coord && this.options.onCellClick) {
        this.options.onCellClick(coord.r, coord.c);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown) return;
      const coord = this.getCellFromMouse(e);
      if (coord && this.options.onCellDrag) {
        this.options.onCellDrag(coord.r, coord.c);
      }
    });
  }
}
