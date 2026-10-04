import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
 * High-visibility, high-contrast STEM theme for both Light & Dark modes
 */
export class GameEngine3D {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls!: OrbitControls;
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

  // 3D Meshes & Groups
  private playerMesh!: THREE.Mesh;
  private playerRingMesh!: THREE.Mesh;
  private exitMesh!: THREE.Mesh;
  private keyMeshes: THREE.Mesh[] = [];
  private cellMeshes: Map<string, THREE.Mesh> = new Map();
  private gridGroup: THREE.Group = new THREE.Group();
  private dynamicGroup: THREE.Group = new THREE.Group();

  // Arena Materials (Theme-aware & high contrast)
  private floorMat!: THREE.MeshStandardMaterial;
  private wallMat!: THREE.MeshStandardMaterial;
  private mudMat!: THREE.MeshStandardMaterial;
  private platformMat!: THREE.MeshStandardMaterial;
  private rimMat!: THREE.MeshStandardMaterial;

  // Lights
  private ambientLight!: THREE.AmbientLight;
  private dirLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private pointLight!: THREE.PointLight;

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

    const isLight = !document.body.classList.contains('dark-theme');

    // Scene & Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(isLight ? 0xebf2fa : 0x0b0f19);

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 500;
    this.camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Orbit Controls for free inspection, rotation and zoom
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.06;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 75;

    // Groups
    this.scene.add(this.gridGroup);
    this.scene.add(this.dynamicGroup);

    // Setup Theme-Aware Materials & Lights
    this.initMaterials(isLight);
    this.setupLights(isLight);

    this.keydownHandler = (e: KeyboardEvent) => this.handleKeyDown(e);
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('resize', () => this.onResize());

    this.animate = this.animate.bind(this);
  }

  private initMaterials(isLight: boolean): void {
    // Floor: In light mode, pure crisp white ceramic for maximum visibility!
    this.floorMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xffffff : 0x131d33,
      roughness: isLight ? 0.35 : 0.75,
      metalness: isLight ? 0.05 : 0.25
    });

    // Walls: In light mode, deep dark obsidian navy for striking 15:1 contrast against white floor!
    this.wallMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x1e293b : 0x334155,
      roughness: isLight ? 0.25 : 0.45,
      metalness: isLight ? 0.35 : 0.65
    });

    // Mud Traps: Rich amber brown with distinct height
    this.mudMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xd97706 : 0x78350f,
      roughness: 0.9,
      metalness: 0.1
    });

    // Base Platform beneath the arena
    this.platformMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xe2e8f0 : 0x070a13,
      roughness: 0.5,
      metalness: 0.1
    });

    // Tournament Border Rim
    this.rimMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x0284c7 : 0x38bdf8,
      roughness: 0.2,
      metalness: 0.8,
      emissive: isLight ? 0x0369a1 : 0x0284c7,
      emissiveIntensity: isLight ? 0.3 : 0.6
    });
  }

  private setupLights(isLight: boolean): void {
    // Ambient Light: Bright and balanced daylight in light mode
    this.ambientLight = new THREE.AmbientLight(
      isLight ? 0xffffff : 0x818cf8,
      isLight ? 0.95 : 0.55
    );
    this.scene.add(this.ambientLight);

    // Directional Sun Light: Strong top-down angle casting crisp soft shadows
    this.dirLight = new THREE.DirectionalLight(
      isLight ? 0xffffff : 0x38bdf8,
      isLight ? 1.45 : 1.2
    );
    this.dirLight.position.set(25, 45, 25);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 140;
    const d = 28;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);

    // Fill Light: Soft blue-tinted fill from the opposite side to eliminate pitch-black shadows
    this.fillLight = new THREE.DirectionalLight(
      isLight ? 0xdbeafe : 0x4f46e5,
      isLight ? 0.45 : 0.25
    );
    this.fillLight.position.set(-25, 30, -25);
    this.scene.add(this.fillLight);

    // Point Light: Warm focal highlight
    this.pointLight = new THREE.PointLight(0xf59e0b, isLight ? 1.4 : 2.5, 45);
    this.pointLight.position.set(0, 16, 0);
    this.scene.add(this.pointLight);
  }

  public updateTheme(isLight: boolean): void {
    if (this.scene) {
      this.scene.background = new THREE.Color(isLight ? 0xebf2fa : 0x0b0f19);
    }
    if (this.floorMat) {
      this.floorMat.color.setHex(isLight ? 0xffffff : 0x131d33);
      this.floorMat.roughness = isLight ? 0.35 : 0.75;
      this.floorMat.metalness = isLight ? 0.05 : 0.25;
      this.floorMat.needsUpdate = true;
    }
    if (this.wallMat) {
      this.wallMat.color.setHex(isLight ? 0x1e293b : 0x334155);
      this.wallMat.roughness = isLight ? 0.25 : 0.45;
      this.wallMat.metalness = isLight ? 0.35 : 0.65;
      this.wallMat.needsUpdate = true;
    }
    if (this.mudMat) {
      this.mudMat.color.setHex(isLight ? 0xd97706 : 0x78350f);
      this.mudMat.needsUpdate = true;
    }
    if (this.platformMat) {
      this.platformMat.color.setHex(isLight ? 0xe2e8f0 : 0x070a13);
      this.platformMat.needsUpdate = true;
    }
    if (this.rimMat) {
      this.rimMat.color.setHex(isLight ? 0x0284c7 : 0x38bdf8);
      this.rimMat.emissive.setHex(isLight ? 0x0369a1 : 0x0284c7);
      this.rimMat.emissiveIntensity = isLight ? 0.3 : 0.6;
      this.rimMat.needsUpdate = true;
    }
    if (this.ambientLight) {
      this.ambientLight.color.setHex(isLight ? 0xffffff : 0x818cf8);
      this.ambientLight.intensity = isLight ? 0.95 : 0.55;
    }
    if (this.dirLight) {
      this.dirLight.color.setHex(isLight ? 0xffffff : 0x38bdf8);
      this.dirLight.intensity = isLight ? 1.45 : 1.2;
    }
    if (this.fillLight) {
      this.fillLight.color.setHex(isLight ? 0xdbeafe : 0x4f46e5);
      this.fillLight.intensity = isLight ? 0.45 : 0.25;
    }
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

    // Position camera closer to fill ~75-80% of the screen height
    this.resetCamera();

    if (this.onStatusChange) this.onStatusChange(this.status);

    if (!this.animFrameId) {
      this.animate();
    }
  }

  public resetCamera(): void {
    const maxDim = Math.max(this.rows, this.cols);
    // Sweet spot isometric angle that fills viewport and clearly reveals walls & corridors
    this.camera.position.set(0, maxDim * 0.72, maxDim * 0.58);
    this.camera.lookAt(0, 0, 0);
    if (this.controls) {
      this.controls.target.set(0, 0, 0);
      this.controls.update();
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

    // 1. Sleek Tournament Base Platform
    const platformGeo = new THREE.BoxGeometry(this.cols + 1.2, 0.35, this.rows + 1.2);
    const platformMesh = new THREE.Mesh(platformGeo, this.platformMat);
    platformMesh.position.set(0, -0.18, 0);
    platformMesh.receiveShadow = true;
    this.gridGroup.add(platformMesh);

    // Outer Tournament Accent Rim
    const rimGeo = new THREE.BoxGeometry(this.cols + 1.45, 0.1, this.rows + 1.45);
    const rimMesh = new THREE.Mesh(rimGeo, this.rimMat);
    rimMesh.position.set(0, -0.32, 0);
    this.gridGroup.add(rimMesh);

    // 2. Arena Cells: 0.93 size leaves a 0.07 gap, creating crisp, clear grid lines!
    const boxGeo = new THREE.BoxGeometry(0.93, 1, 0.93);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const type = this.grid[r][c];
        let mat = this.floorMat;
        let h = 0.1;

        if (type === NodeType.WALL) {
          mat = this.wallMat;
          h = 1.4; // Distinct tall pillars
        } else if (type === NodeType.MUD) {
          mat = this.mudMat;
          h = 0.28;
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

    // 3. Player Mesh (Hero Cyan Crystal Gem with Glowing Ring)
    const playerGeo = new THREE.DodecahedronGeometry(0.48);
    const playerMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.7,
      roughness: 0.15,
      metalness: 0.3
    });
    this.playerMesh = new THREE.Mesh(playerGeo, playerMat);
    this.playerMesh.castShadow = true;
    this.updateMeshCoord(this.playerMesh, this.playerPos, 0.55);
    this.dynamicGroup.add(this.playerMesh);

    // Glowing base ring under player to track exact grid cell
    const ringGeo = new THREE.RingGeometry(0.28, 0.42, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    this.playerRingMesh = new THREE.Mesh(ringGeo, ringMat);
    this.playerRingMesh.rotation.x = -Math.PI / 2;
    this.updateMeshCoord(this.playerRingMesh, this.playerPos, 0.055);
    this.dynamicGroup.add(this.playerRingMesh);

    // 4. Exit Portal (Glowing Emerald Ring & Core)
    const portalGeo = new THREE.TorusGeometry(0.46, 0.12, 16, 32);
    const portalMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 1.1,
      roughness: 0.2
    });
    this.exitMesh = new THREE.Mesh(portalGeo, portalMat);
    this.exitMesh.rotation.x = Math.PI / 2;
    this.exitMesh.castShadow = true;
    this.updateMeshCoord(this.exitMesh, this.exitPos, 0.45);
    this.dynamicGroup.add(this.exitMesh);

    // 5. Keys (Spinning Gold Pyramids with Float Animation)
    const keyGeo = new THREE.OctahedronGeometry(0.38);
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.8
    });

    for (const kp of this.keyPositions) {
      const km = new THREE.Mesh(keyGeo, keyMat);
      km.castShadow = true;
      this.updateMeshCoord(km, kp, 0.45);
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
          new THREE.SphereGeometry(0.44, 16, 16),
          new THREE.MeshStandardMaterial({
            color: 0x10b981,
            emissive: 0x059669,
            emissiveIntensity: 0.8,
            roughness: 0.2
          })
        ),
        path: [],
        color: 0x10b981,
        speedIntervalMs: 500,
        lastMoveTime: 0
      },
      {
        name: 'Inky (Dijkstra AI)',
        type: 'dijkstra',
        pos: { r: 1, c: this.cols - 2 },
        mesh: new THREE.Mesh(
          new THREE.BoxGeometry(0.72, 0.72, 0.72),
          new THREE.MeshStandardMaterial({
            color: 0x2563eb,
            emissive: 0x1d4ed8,
            emissiveIntensity: 0.8,
            roughness: 0.2
          })
        ),
        path: [],
        color: 0x2563eb,
        speedIntervalMs: 450,
        lastMoveTime: 0
      },
      {
        name: 'Shadow (A* Hunter)',
        type: 'astar',
        pos: { r: this.rows - 2, c: this.cols - 4 },
        mesh: new THREE.Mesh(
          new THREE.ConeGeometry(0.42, 0.85, 16),
          new THREE.MeshStandardMaterial({
            color: 0xef4444,
            emissive: 0xdc2626,
            emissiveIntensity: 1.0,
            roughness: 0.15
          })
        ),
        path: [],
        color: 0xef4444,
        speedIntervalMs: 380,
        lastMoveTime: 0
      }
    ];

    for (const enemy of this.enemies) {
      enemy.mesh.castShadow = true;
      this.updateMeshCoord(enemy.mesh, enemy.pos, 0.52);
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
      this.updateMeshCoord(this.playerMesh, this.playerPos, 0.55);
      if (this.playerRingMesh) {
        this.updateMeshCoord(this.playerRingMesh, this.playerPos, 0.055);
      }

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

    // Convert cell to a mud trap
    this.grid[r][c] = NodeType.MUD;
    this.status.trapsAvailable--;

    const mesh = this.cellMeshes.get(`${r},${c}`);
    if (mesh) {
      mesh.material = this.mudMat;
      mesh.scale.set(1, 0.35, 1);
      mesh.position.y = 0.175;
    }

    if (this.onStatusChange) this.onStatusChange(this.status);

    // Prompt all enemies to recalculate path
    this.recalculateAllEnemyPaths();
  }

  private recalculateAllEnemyPaths(): void {
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
        enemy.path = res.shortestPath.slice(1);
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

        if (enemy.path.length === 0) {
          this.recalculateAllEnemyPaths();
        }

        if (enemy.path.length > 0) {
          const nextCell = enemy.path.shift()!;
          enemy.pos = nextCell;
          this.updateMeshCoord(enemy.mesh, enemy.pos, 0.52);

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

    // Orbit Controls Damping Update
    if (this.controls) {
      this.controls.update();
    }

    // Smooth Hover & Spin Animations for Entities
    const floatOffset = Math.sin(now * 0.005) * 0.08;

    for (let i = 0; i < this.keyMeshes.length; i++) {
      const km = this.keyMeshes[i];
      km.rotation.y += 0.035;
      km.rotation.x += 0.015;
      km.position.y = 0.45 + floatOffset;
    }

    if (this.exitMesh) {
      this.exitMesh.rotation.z += 0.025;
    }

    if (this.playerMesh) {
      this.playerMesh.rotation.y += 0.018;
      this.playerMesh.position.y = 0.55 + Math.sin(now * 0.007) * 0.04;
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
    if (this.controls) {
      this.controls.update();
    }
  }

  public destroy(): void {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('keydown', this.keydownHandler);
    if (this.controls) {
      this.controls.dispose();
    }
    this.renderer.dispose();
  }
}
