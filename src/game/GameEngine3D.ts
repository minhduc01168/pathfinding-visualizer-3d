import * as THREE from 'three';
import { runAStar } from '../core/algorithms/astar';
import { runBFS } from '../core/algorithms/bfs';
import { runDijkstra } from '../core/algorithms/dijkstra';
import { GridCoord, GridNode, NODE_COSTS, NodeType } from '../core/types';

export interface GameStatus {
  hp: number;
  maxHp: number;
  keysCollected: number;
  totalKeys: number;
  trapsAvailable: number;
  isGameOver: boolean;
  isVictory: boolean;
}

/**
 * 3D Arcade Arena ("AI Dungeon Chase") Game Engine
 */
export class GameEngine3D {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;

  // Grid Data
  private rows: number = 21;
  private cols: number = 27;
  private grid: NodeType[][] = [];

  // Entities
  private playerPos: GridCoord = { r: 1, c: 1 };
  private exitPos: GridCoord = { r: 19, c: 25 };
  private keyPositions: GridCoord[] = [];

  // AI Enemies
  private enemies: {
    name: string;
    type: 'bfs' | 'dijkstra' | 'astar';
    pos: GridCoord;
    mesh: THREE.Mesh;
    path: GridCoord[];
    color: number;
    speedIntervalMs: number;
    lastMoveTime: number;
  }[] = [];

  // 3D Meshes
  private playerMesh!: THREE.Mesh;
  private exitMesh!: THREE.Mesh;
  private keyMeshes: THREE.Mesh[] = [];
  private cellMeshes: Map<string, THREE.Mesh> = new Map();
  private gridGroup: THREE.Group = new THREE.Group();
  private dynamicGroup: THREE.Group = new THREE.Group();

  // Game Status
  public status: GameStatus = {
    hp: 100,
    maxHp: 100,
    keysCollected: 0,
    totalKeys: 3,
    trapsAvailable: 5,
    isGameOver: false,
    isVictory: false
  };

  private onStatusChange?: (status: GameStatus) => void;
  private keydownHandler: (e: KeyboardEvent) => void;

  constructor(container: HTMLElement, onStatusChange?: (status: GameStatus) => void) {
    this.container = container;
    this.onStatusChange = onStatusChange;

    // Three.js setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06080e);

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 500;
    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    this.scene.add(this.gridGroup);
    this.scene.add(this.dynamicGroup);

    this.setupLights();

    this.keydownHandler = (e: KeyboardEvent) => this.handleKeyDown(e);
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('resize', () => this.onResize());

    this.animate = this.animate.bind(this);
  }

  private setupLights(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.3);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xf59e0b, 2, 40);
    pointLight.position.set(0, 15, 0);
    this.scene.add(pointLight);
  }

  public initGame(rows: number = 21, cols: number = 27): void {
    this.rows = rows;
    this.cols = cols;

    // Reset status
    this.status = {
      hp: 100,
      maxHp: 100,
      keysCollected: 0,
      totalKeys: 3,
      trapsAvailable: 5,
      isGameOver: false,
      isVictory: false
    };

    // Build arena grid with corridors and open rooms
    this.grid = [];
    for (let r = 0; r < rows; r++) {
      const row: NodeType[] = [];
      for (let c = 0; c < cols; c++) {
        if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
          row.push(NodeType.WALL);
        } else if (r % 2 === 0 && c % 2 === 0 && Math.random() < 0.6) {
          row.push(NodeType.WALL);
        } else if (Math.random() < 0.08) {
          row.push(NodeType.MUD);
        } else {
          row.push(NodeType.EMPTY);
        }
      }
      this.grid.push(row);
    }

    // Set player and exit positions
    this.playerPos = { r: 1, c: 1 };
    this.exitPos = { r: rows - 2, c: cols - 2 };
    this.grid[this.playerPos.r][this.playerPos.c] = NodeType.EMPTY;
    this.grid[this.exitPos.r][this.exitPos.c] = NodeType.EMPTY;

    // Spawn 3 keys in accessible open rooms
    this.keyPositions = [
      { r: Math.floor(rows * 0.25), c: cols - 3 },
      { r: rows - 3, c: Math.floor(cols * 0.3) },
      { r: Math.floor(rows * 0.65), c: Math.floor(cols * 0.7) }
    ];
    for (const k of this.keyPositions) {
      this.grid[k.r][k.c] = NodeType.EMPTY;
    }

    // Build 3D Arena Meshes
    this.buildArenaMeshes();

    // Spawn Enemies at distant points
    this.spawnEnemies();

    // Camera view looking down at an action isometric angle
    const maxDim = Math.max(rows, cols);
    this.camera.position.set(0, maxDim * 1.1, maxDim * 0.85);
    this.camera.lookAt(0, 0, 0);

    if (this.onStatusChange) this.onStatusChange(this.status);

    if (!this.animFrameId) {
      this.animate();
    }
  }

  private buildArenaMeshes(): void {
    // Clear old meshes
    while (this.gridGroup.children.length > 0) {
      this.gridGroup.remove(this.gridGroup.children.pop()!);
    }
    while (this.dynamicGroup.children.length > 0) {
      this.dynamicGroup.remove(this.dynamicGroup.children.pop()!);
    }
    this.cellMeshes.clear();
    this.keyMeshes = [];

    const offsetX = (this.cols - 1) / 2;
    const offsetZ = (this.rows - 1) / 2;
    const boxGeo = new THREE.BoxGeometry(0.9, 1, 0.9);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const mudMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const type = this.grid[r][c];
        let mat = floorMat;
        let h = 0.1;

        if (type === NodeType.WALL) {
          mat = wallMat;
          h = 1.3;
        } else if (type === NodeType.MUD) {
          mat = mudMat;
          h = 0.25;
        }

        const mesh = new THREE.Mesh(boxGeo, mat);
        mesh.scale.set(1, h, 1);
        mesh.position.set(c - offsetX, h / 2, r - offsetZ);
        mesh.castShadow = type === NodeType.WALL;
        mesh.receiveShadow = true;

        this.gridGroup.add(mesh);
        this.cellMeshes.set(`${r},${c}`, mesh);
      }
    }

    // Player Mesh (Golden Cyan Cyber Gem)
    const playerGeo = new THREE.DodecahedronGeometry(0.45);
    const playerMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });
    this.playerMesh = new THREE.Mesh(playerGeo, playerMat);
    this.updateMeshCoord(this.playerMesh, this.playerPos, 0.5);
    this.dynamicGroup.add(this.playerMesh);

    // Exit Portal (Glowing Ring & Crystal)
    const portalGeo = new THREE.TorusGeometry(0.4, 0.1, 16, 32);
    const portalMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.9
    });
    this.exitMesh = new THREE.Mesh(portalGeo, portalMat);
    this.exitMesh.rotation.x = Math.PI / 2;
    this.updateMeshCoord(this.exitMesh, this.exitPos, 0.4);
    this.dynamicGroup.add(this.exitMesh);

    // Keys (Spinning Gold Pyramids)
    const keyGeo = new THREE.OctahedronGeometry(0.35);
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.8
    });

    for (const kp of this.keyPositions) {
      const km = new THREE.Mesh(keyGeo, keyMat);
      this.updateMeshCoord(km, kp, 0.4);
      this.dynamicGroup.add(km);
      this.keyMeshes.push(km);
    }
  }

  private spawnEnemies(): void {
    this.enemies = [
      {
        name: 'Blinky (BFS AI)',
        type: 'bfs',
        pos: { r: this.rows - 2, c: 1 },
        mesh: new THREE.Mesh(
          new THREE.SphereGeometry(0.4, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.7 })
        ),
        path: [],
        color: 0x22c55e,
        speedIntervalMs: 500,
        lastMoveTime: 0
      },
      {
        name: 'Inky (Dijkstra AI)',
        type: 'dijkstra',
        pos: { r: 1, c: this.cols - 2 },
        mesh: new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.7, 0.7),
          new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x2563eb, emissiveIntensity: 0.7 })
        ),
        path: [],
        color: 0x3b82f6,
        speedIntervalMs: 450,
        lastMoveTime: 0
      },
      {
        name: 'Shadow (A* Hunter)',
        type: 'astar',
        pos: { r: this.rows - 2, c: this.cols - 4 },
        mesh: new THREE.Mesh(
          new THREE.ConeGeometry(0.4, 0.8, 16),
          new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.9 })
        ),
        path: [],
        color: 0xef4444,
        speedIntervalMs: 380,
        lastMoveTime: 0
      }
    ];

    for (const enemy of this.enemies) {
      this.updateMeshCoord(enemy.mesh, enemy.pos, 0.5);
      this.dynamicGroup.add(enemy.mesh);
    }
  }

  private updateMeshCoord(mesh: THREE.Object3D, coord: GridCoord, y: number): void {
    const offsetX = (this.cols - 1) / 2;
    const offsetZ = (this.rows - 1) / 2;
    mesh.position.set(coord.c - offsetX, y, coord.r - offsetZ);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.status.isGameOver || this.status.isVictory) return;

    let nr = this.playerPos.r;
    let nc = this.playerPos.c;

    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      nr--;
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      nr++;
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      nc--;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      nc++;
    } else if (e.code === 'Space') {
      // Place trap behind player
      this.placeTrap();
      return;
    } else {
      return;
    }

    // Check collision with walls
    if (
      nr >= 0 &&
      nr < this.rows &&
      nc >= 0 &&
      nc < this.cols &&
      this.grid[nr][nc] !== NodeType.WALL
    ) {
      this.playerPos = { r: nr, c: nc };
      this.updateMeshCoord(this.playerMesh, this.playerPos, 0.5);

      // Check key pickup
      for (let i = this.keyPositions.length - 1; i >= 0; i--) {
        const kp = this.keyPositions[i];
        if (kp.r === nr && kp.c === nc) {
          this.keyPositions.splice(i, 1);
          const km = this.keyMeshes[i];
          this.dynamicGroup.remove(km);
          this.keyMeshes.splice(i, 1);
          this.status.keysCollected++;
          if (this.onStatusChange) this.onStatusChange(this.status);
        }
      }

      // Check exit reached
      if (
        this.playerPos.r === this.exitPos.r &&
        this.playerPos.c === this.exitPos.c &&
        this.status.keysCollected >= this.status.totalKeys
      ) {
        this.status.isVictory = true;
        if (this.onStatusChange) this.onStatusChange(this.status);
      }
    }
  }

  public placeTrap(): void {
    if (this.status.trapsAvailable <= 0) return;
    const r = this.playerPos.r;
    const c = this.playerPos.c;

    // Convert cell to a mud trap or barricade
    this.grid[r][c] = NodeType.MUD;
    this.status.trapsAvailable--;

    const mesh = this.cellMeshes.get(`${r},${c}`);
    if (mesh) {
      mesh.material = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      mesh.scale.set(1, 0.35, 1);
      mesh.position.y = 0.175;
    }

    if (this.onStatusChange) this.onStatusChange(this.status);

    // Prompt all enemies to recalculate path
    this.recalculateAllEnemyPaths();
  }

  private recalculateAllEnemyPaths(): void {
    // Construct GridNode representation for search
    const searchGrid: GridNode[][] = [];
    for (let r = 0; r < this.rows; r++) {
      const row: GridNode[] = [];
      for (let c = 0; c < this.cols; c++) {
        const type = this.grid[r][c];
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

    for (const enemy of this.enemies) {
      let res;
      if (enemy.type === 'bfs') {
        res = runBFS(searchGrid, enemy.pos, this.playerPos);
      } else if (enemy.type === 'dijkstra') {
        res = runDijkstra(searchGrid, enemy.pos, this.playerPos);
      } else {
        res = runAStar(searchGrid, enemy.pos, this.playerPos);
      }

      if (res && res.shortestPath.length > 1) {
        enemy.path = res.shortestPath.slice(1); // Exclude current cell
      } else {
        enemy.path = [];
      }
    }
  }

  private updateEnemyAI(now: number): void {
    if (this.status.isGameOver || this.status.isVictory) return;

    for (const enemy of this.enemies) {
      if (now - enemy.lastMoveTime >= enemy.speedIntervalMs) {
        enemy.lastMoveTime = now;

        // If no path or target moved, recalculate
        if (enemy.path.length === 0) {
          this.recalculateAllEnemyPaths();
        }

        if (enemy.path.length > 0) {
          const nextCell = enemy.path.shift()!;
          enemy.pos = nextCell;
          this.updateMeshCoord(enemy.mesh, enemy.pos, 0.5);

          // Check collision with player
          if (enemy.pos.r === this.playerPos.r && enemy.pos.c === this.playerPos.c) {
            this.status.hp = Math.max(0, this.status.hp - 35);
            if (this.status.hp <= 0) {
              this.status.isGameOver = true;
            }
            if (this.onStatusChange) this.onStatusChange(this.status);
          }
        }
      }
    }
  }

  private animate(): void {
    this.animFrameId = requestAnimationFrame(this.animate);

    const now = performance.now();

    // Rotate keys & portal for juice
    for (const km of this.keyMeshes) {
      km.rotation.y += 0.03;
      km.rotation.x += 0.01;
    }
    if (this.exitMesh) {
      this.exitMesh.rotation.z += 0.02;
    }

    this.updateEnemyAI(now);
    this.renderer.render(this.scene, this.camera);
  }

  public onResize(): void {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  public destroy(): void {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('keydown', this.keydownHandler);
    this.renderer.dispose();
  }
}
