import { Dashboard } from './components/Dashboard';
import {
  createEmptyGrid,
  generateRandomTerrain,
  generateRecursiveBacktracking,
  generateWeightTrapChallenge
} from './core/maze/mazeGenerators';
import { BrushMode, GridCoord, NodeType, SearchResult } from './core/types';
import { GameEngine3D } from './game/GameEngine3D';
import { GridCanvas2D } from './renderer/GridCanvas2D';
import { ThreeEngine } from './renderer/ThreeEngine';
import { TriSplitView } from './renderer/TriSplitView';

// Application Global State
let rows = 21;
let cols = 35;
let grid: NodeType[][] = [];
let startCoord: GridCoord = { r: 5, c: 5 };
let endCoord: GridCoord = { r: 15, c: 29 };
let activeBrush: BrushMode = 'wall';
let currentSpeedMultiplier = 2.5;

// Component Instances
let masterCanvas: GridCanvas2D;
let triSplitView: TriSplitView;
let dashboard: Dashboard;
let threeEngine: ThreeEngine | null = null;
let gameEngine: GameEngine3D | null = null;

// Trace Cache
let latestResults: Map<string, SearchResult> = new Map();

// Initialize Everything on Window Load
window.addEventListener('DOMContentLoaded', () => {
  setupApp();
});

function setupApp(): void {
  initGridData(rows, cols);

  // Initialize Master Canvas
  const masterCanvasEl = document.getElementById('master-canvas') as HTMLCanvasElement;
  masterCanvas = new GridCanvas2D(masterCanvasEl, {
    interactive: true,
    onCellClick: handleMasterCellPaint,
    onCellDrag: handleMasterCellPaint
  });
  masterCanvas.init(rows, cols);

  // Initialize Tri-Split Canvases
  const canvasBfs = document.getElementById('canvas-bfs') as HTMLCanvasElement;
  const canvasDijkstra = document.getElementById('canvas-dijkstra') as HTMLCanvasElement;
  const canvasAstar = document.getElementById('canvas-astar') as HTMLCanvasElement;

  triSplitView = new TriSplitView(canvasBfs, canvasDijkstra, canvasAstar);
  triSplitView.init(rows, cols);

  // Initialize Dashboard
  const dashboardContainer = document.getElementById('dashboard-container') as HTMLElement;
  dashboard = new Dashboard(dashboardContainer);
  dashboard.render(new Map(), rows * cols);

  // Initial Render
  syncAllCanvases();

  // Attach DOM Listeners
  attachControls();
  window.addEventListener('resize', handleWindowResize);
}

function initGridData(r: number, c: number): void {
  rows = r;
  cols = c;
  startCoord = { r: Math.floor(r * 0.25), c: Math.floor(c * 0.15) };
  endCoord = { r: Math.floor(r * 0.75), c: Math.floor(c * 0.85) };
  grid = createEmptyGrid(rows, cols);
}

function syncAllCanvases(): void {
  masterCanvas.render(grid, startCoord, endCoord);
  triSplitView.renderAll(grid, startCoord, endCoord);
}

function handleMasterCellPaint(r: number, c: number): void {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;

  if (activeBrush === 'start') {
    if (r === endCoord.r && c === endCoord.c) return;
    startCoord = { r, c };
    grid[r][c] = NodeType.EMPTY;
  } else if (activeBrush === 'end') {
    if (r === startCoord.r && c === startCoord.c) return;
    endCoord = { r, c };
    grid[r][c] = NodeType.EMPTY;
  } else {
    if ((r === startCoord.r && c === startCoord.c) || (r === endCoord.r && c === endCoord.c)) {
      return;
    }

    if (activeBrush === 'wall') grid[r][c] = NodeType.WALL;
    else if (activeBrush === 'mud') grid[r][c] = NodeType.MUD;
    else if (activeBrush === 'water') grid[r][c] = NodeType.WATER;
    else if (activeBrush === 'eraser') grid[r][c] = NodeType.EMPTY;
  }

  syncAllCanvases();
}

function attachControls(): void {
  // Theme Switcher (Dark / Light)
  const btnThemeToggle = document.getElementById('btn-theme-toggle') as HTMLButtonElement;
  const themeIcon = document.getElementById('theme-icon') as HTMLElement;
  const themeText = document.getElementById('theme-text') as HTMLElement;

  btnThemeToggle?.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    if (isLight) {
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Chế Độ Tối';
    } else {
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Chế Độ Sáng';
    }
    syncAllCanvases();
  });

  // Mode Switcher: Lab vs Arcade
  const btnModeLab = document.getElementById('btn-mode-lab') as HTMLButtonElement;
  const btnModeArcade = document.getElementById('btn-mode-arcade') as HTMLButtonElement;
  const labContainer = document.getElementById('lab-view-container') as HTMLElement;
  const arcadeContainer = document.getElementById('arcade-view-container') as HTMLElement;
  const toolbar = document.getElementById('control-toolbar') as HTMLElement;

  btnModeLab.addEventListener('click', () => {
    btnModeLab.classList.add('active');
    btnModeArcade.classList.remove('active');
    labContainer.style.display = 'flex';
    arcadeContainer.classList.remove('active');
    toolbar.style.display = 'flex';
    triSplitView.resize();
    masterCanvas.resize();
    syncAllCanvases();
  });

  btnModeArcade.addEventListener('click', () => {
    btnModeArcade.classList.add('active');
    btnModeLab.classList.remove('active');
    labContainer.style.display = 'none';
    arcadeContainer.classList.add('active');
    toolbar.style.display = 'none';

    // Init 3D Arcade Arena if not created
    const arena3DContainer = document.getElementById('arcade-3d-container') as HTMLElement;
    if (!gameEngine) {
      gameEngine = new GameEngine3D(arena3DContainer, updateArcadeHUD);
    }
    gameEngine.initGame(21, 27);
  });

  // Brush Buttons
  const brushButtons = document.querySelectorAll<HTMLButtonElement>('.brush-btn');
  brushButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      brushButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeBrush = (btn.getAttribute('data-brush') as BrushMode) || 'wall';
    });
  });

  // Grid Presets
  const presetSelect = document.getElementById('select-grid-preset') as HTMLSelectElement;
  presetSelect.addEventListener('change', () => {
    const val = presetSelect.value;
    let newR = 21,
      newC = 35;
    if (val === '25x15') {
      newR = 15;
      newC = 25;
    } else if (val === '50x30') {
      newR = 30;
      newC = 50;
    }
    initGridData(newR, newC);
    masterCanvas.init(rows, cols);
    triSplitView.init(rows, cols);
    triSplitView.clearAllTraces(grid, startCoord, endCoord);
    latestResults.clear();
    dashboard.render(latestResults, rows * cols);
    syncAllCanvases();
  });

  // Maze Generator Select
  const mazeSelect = document.getElementById('select-maze') as HTMLSelectElement;
  mazeSelect.addEventListener('change', () => {
    const choice = mazeSelect.value;
    if (choice === 'recursive') {
      grid = generateRecursiveBacktracking(rows, cols, startCoord, endCoord);
    } else if (choice === 'random') {
      grid = generateRandomTerrain(rows, cols, startCoord, endCoord, 0.25, 0.15, 0.08);
    } else if (choice === 'trap') {
      grid = generateWeightTrapChallenge(rows, cols, startCoord, endCoord);
    }
    mazeSelect.value = 'none'; // reset dropdown
    triSplitView.clearAllTraces(grid, startCoord, endCoord);
    syncAllCanvases();
  });

  // Speed Multiplier
  const speedSelect = document.getElementById('select-speed') as HTMLSelectElement;
  speedSelect.addEventListener('change', () => {
    currentSpeedMultiplier = parseFloat(speedSelect.value);
  });

  // Race Button (Start Tri-Split Simulation)
  const btnRace = document.getElementById('btn-race') as HTMLButtonElement;
  btnRace.addEventListener('click', async () => {
    btnRace.disabled = true;
    btnRace.innerHTML = `<span>⏳</span> Đang Chạy Đua...`;

    updateStatusBadge('bfs-status', 'Đang quét...', 'running');
    updateStatusBadge('dijkstra-status', 'Đang quét...', 'running');
    updateStatusBadge('astar-status', 'Đang quét...', 'running');

    latestResults = await triSplitView.startRace(
      grid,
      startCoord,
      endCoord,
      currentSpeedMultiplier,
      {
        onComplete: (results) => {
          btnRace.disabled = false;
          btnRace.innerHTML = `<span>▶</span> Chạy Đua (Race All)`;

          const bfsRes = results.get('bfs');
          const dijRes = results.get('dijkstra');
          const astarRes = results.get('astar');

          updateStatusBadge(
            'bfs-status',
            bfsRes?.metrics.found ? 'Lưu vết thành công' : 'Bế tắc',
            bfsRes?.metrics.found ? 'success' : 'failed'
          );
          updateStatusBadge(
            'dijkstra-status',
            dijRes?.metrics.found ? 'Lưu vết thành công' : 'Bế tắc',
            dijRes?.metrics.found ? 'success' : 'failed'
          );
          updateStatusBadge(
            'astar-status',
            astarRes?.metrics.found ? 'Lưu vết thành công' : 'Bế tắc',
            astarRes?.metrics.found ? 'success' : 'failed'
          );

          // Update Scientific Dashboard
          dashboard.render(results, rows * cols);
        }
      }
    );
  });

  // Clear Trace Button (Keeps walls and terrain, removes wave and path)
  const btnClearTrace = document.getElementById('btn-clear-trace') as HTMLButtonElement;
  btnClearTrace.addEventListener('click', () => {
    triSplitView.clearAllTraces(grid, startCoord, endCoord);
    updateStatusBadge('bfs-status', 'Sẵn sàng', 'idle');
    updateStatusBadge('dijkstra-status', 'Sẵn sàng', 'idle');
    updateStatusBadge('astar-status', 'Sẵn sàng', 'idle');
    latestResults.clear();
    dashboard.render(latestResults, rows * cols);
  });

  // Reset Grid Button (Clears everything to empty grid)
  const btnResetGrid = document.getElementById('btn-reset-grid') as HTMLButtonElement;
  btnResetGrid.addEventListener('click', () => {
    grid = createEmptyGrid(rows, cols);
    triSplitView.clearAllTraces(grid, startCoord, endCoord);
    updateStatusBadge('bfs-status', 'Sẵn sàng', 'idle');
    updateStatusBadge('dijkstra-status', 'Sẵn sàng', 'idle');
    updateStatusBadge('astar-status', 'Sẵn sàng', 'idle');
    latestResults.clear();
    dashboard.render(latestResults, rows * cols);
    syncAllCanvases();
  });

  // 3D Voxel Inspector Modal
  const btnOpen3D = document.getElementById('btn-open-3d') as HTMLButtonElement;
  const modal3D = document.getElementById('modal-3d') as HTMLElement;
  const btnCloseModal3D = document.getElementById('btn-close-modal-3d') as HTMLButtonElement;
  const modal3DViewport = document.getElementById('modal-3d-viewport') as HTMLElement;

  btnOpen3D.addEventListener('click', () => {
    modal3D.classList.add('active');

    if (!threeEngine) {
      threeEngine = new ThreeEngine(modal3DViewport);
    }
    threeEngine.rebuildGrid(grid, startCoord, endCoord);
    threeEngine.setIsometricView(rows, cols);

    // If A* shortest path exists, show it in 3D!
    const astarResult = latestResults.get('astar');
    if (astarResult && astarResult.shortestPath.length > 0) {
      for (const p of astarResult.visitedOrder) {
        threeEngine.markVisited(p.r, p.c);
      }
      threeEngine.renderShortestPath(astarResult.shortestPath);
    }

    setTimeout(() => {
      threeEngine?.onResize();
    }, 100);
  });

  btnCloseModal3D.addEventListener('click', () => {
    modal3D.classList.remove('active');
  });

  // 3D Camera Presets
  document.getElementById('btn-cam-iso')?.addEventListener('click', () => {
    threeEngine?.setIsometricView(rows, cols);
  });
  document.getElementById('btn-cam-top')?.addEventListener('click', () => {
    threeEngine?.setTopDownView(rows, cols);
  });
  document.getElementById('btn-cam-reset')?.addEventListener('click', () => {
    threeEngine?.focusCamera(rows, cols);
  });

  // Arcade Controls
  document.getElementById('btn-arcade-restart')?.addEventListener('click', () => {
    gameEngine?.initGame(21, 27);
  });
  document.getElementById('btn-overlay-action')?.addEventListener('click', () => {
    gameEngine?.initGame(21, 27);
  });
}

function updateStatusBadge(id: string, text: string, statusClass: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = `status-badge ${statusClass}`;
}

function updateArcadeHUD(st: any): void {
  const hpFill = document.getElementById('hud-hp-bar');
  const hpText = document.getElementById('hud-hp-text');
  const keysText = document.getElementById('hud-keys-text');
  const trapsText = document.getElementById('hud-traps-text');
  const overlay = document.getElementById('game-overlay');
  const overlayTitle = document.getElementById('game-overlay-title');
  const overlayDesc = document.getElementById('game-overlay-desc');

  if (hpFill && hpText) {
    const pct = (st.hp / st.maxHp) * 100;
    hpFill.style.width = `${pct}%`;
    hpText.textContent = `${st.hp} / ${st.maxHp}`;
  }

  if (keysText) {
    keysText.textContent = `${st.keysCollected} / ${st.totalKeys}`;
  }

  if (trapsText) {
    trapsText.textContent = `${st.trapsAvailable} lượt`;
  }

  if (overlay && overlayTitle && overlayDesc) {
    if (st.isVictory) {
      overlay.classList.add('active');
      overlayTitle.textContent = 'CHIẾN THẮNG!';
      overlayTitle.className = 'game-overlay-title victory';
      overlayDesc.textContent =
        'Xuất sắc! Bạn đã thu thập đủ 3 chìa khóa và kích hoạt cổng thoát hiểm trước khi các AI bắt kịp!';
    } else if (st.isGameOver) {
      overlay.classList.add('active');
      overlayTitle.textContent = 'BỊ HẠ GỤC!';
      overlayTitle.className = 'game-overlay-title gameover';
      overlayDesc.textContent =
        'Bạn đã bị các AI thợ săn (A*, Dijkstra hoặc BFS) bao vây và cạn kiệt sinh lực!';
    } else {
      overlay.classList.remove('active');
    }
  }
}

function handleWindowResize(): void {
  masterCanvas?.resize();
  triSplitView?.resize();
  syncAllCanvases();
  threeEngine?.onResize();
  gameEngine?.onResize();
}
