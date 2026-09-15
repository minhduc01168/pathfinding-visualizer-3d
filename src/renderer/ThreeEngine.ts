import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GridCoord, NodeType } from '../core/types';

/**
 * High-performance 3D Voxel Engine with Animated Beacons and Evocative Terrain
 */
export class ThreeEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private animFrameId: number | null = null;

  // Grid mesh references
  private cellMeshes: Map<string, THREE.Mesh> = new Map();
  private gridGroup: THREE.Group = new THREE.Group();
  private pathLineGroup: THREE.Group = new THREE.Group();
  private beaconGroup: THREE.Group = new THREE.Group();

  // Dynamic Beacon objects
  private startBeaconMesh?: THREE.Mesh;
  private endPortalRing?: THREE.Mesh;
  private endPortalCrystal?: THREE.Mesh;

  // Materials cache
  private materials = {
    empty: new THREE.MeshStandardMaterial({
      color: 0x172033,
      roughness: 0.8,
      metalness: 0.2
    }),
    wall: new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.7,
      emissive: 0x0f172a,
      emissiveIntensity: 0.3
    }),
    mud: new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.9,
      metalness: 0.1,
      emissive: 0x78350f,
      emissiveIntensity: 0.2
    }),
    water: new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88
    }),
    start: new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.9,
      roughness: 0.2
    }),
    end: new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.9,
      roughness: 0.2
    }),
    visited: new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x4338ca,
      emissiveIntensity: 0.4,
      roughness: 0.5
    }),
    path: new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.95,
      roughness: 0.1
    })
  };

  private boxGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.92, 1, 0.92);

  constructor(container: HTMLElement) {
    this.container = container;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070a13);

    // Camera
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;

    // Lights
    this.setupLighting();

    // Groups
    this.scene.add(this.gridGroup);
    this.scene.add(this.pathLineGroup);
    this.scene.add(this.beaconGroup);

    // Start render loop
    this.animate = this.animate.bind(this);
    this.animate();

    window.addEventListener('resize', () => this.onResize());
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight.position.set(30, 50, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xf43f5e, 1.8, 60);
    pointLight.position.set(-20, 25, -20);
    this.scene.add(pointLight);
  }

  public rebuildGrid(
    grid: NodeType[][],
    start: GridCoord,
    end: GridCoord
  ): void {
    while (this.gridGroup.children.length > 0) {
      this.gridGroup.remove(this.gridGroup.children.pop()!);
    }
    while (this.beaconGroup.children.length > 0) {
      this.beaconGroup.remove(this.beaconGroup.children.pop()!);
    }
    this.cellMeshes.clear();
    this.clearPathAndVisited();

    const rows = grid.length;
    const cols = grid[0].length;
    const offsetX = (cols - 1) / 2;
    const offsetZ = (rows - 1) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let type = grid[r][c];
        if (r === start.r && c === start.c) type = NodeType.START;
        else if (r === end.r && c === end.c) type = NodeType.END;

        const mesh = this.createCellMesh(type);
        mesh.position.set(c - offsetX, this.getCellHeight(type) / 2, r - offsetZ);
        mesh.castShadow = type === NodeType.WALL;
        mesh.receiveShadow = true;

        this.gridGroup.add(mesh);
        this.cellMeshes.set(`${r},${c}`, mesh);
      }
    }

    // Create 3D Beacon for START (Vertical Glowing Beam)
    const beamGeo = new THREE.CylinderGeometry(0.18, 0.25, 2.5, 16);
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.85
    });
    this.startBeaconMesh = new THREE.Mesh(beamGeo, beamMat);
    this.startBeaconMesh.position.set(start.c - offsetX, 1.6, start.r - offsetZ);
    this.beaconGroup.add(this.startBeaconMesh);

    // Create 3D Portal for END (Hovering Ruby Crystal & Torus Ring)
    const ringGeo = new THREE.TorusGeometry(0.55, 0.1, 16, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xdc2626,
      emissiveIntensity: 1.2
    });
    this.endPortalRing = new THREE.Mesh(ringGeo, ringMat);
    this.endPortalRing.position.set(end.c - offsetX, 1.8, end.r - offsetZ);
    this.beaconGroup.add(this.endPortalRing);

    const crystalGeo = new THREE.OctahedronGeometry(0.35);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.0,
      roughness: 0.1
    });
    this.endPortalCrystal = new THREE.Mesh(crystalGeo, crystalMat);
    this.endPortalCrystal.position.set(end.c - offsetX, 1.8, end.r - offsetZ);
    this.beaconGroup.add(this.endPortalCrystal);

    this.focusCamera(rows, cols);
  }

  private getCellHeight(type: NodeType): number {
    switch (type) {
      case NodeType.WALL:
        return 1.6;
      case NodeType.START:
      case NodeType.END:
        return 0.8;
      case NodeType.MUD:
        return 0.25;
      case NodeType.WATER:
        return 0.12;
      default:
        return 0.1;
    }
  }

  private createCellMesh(type: NodeType): THREE.Mesh {
    let mat = this.materials.empty;
    let height = this.getCellHeight(type);

    switch (type) {
      case NodeType.WALL:
        mat = this.materials.wall;
        break;
      case NodeType.MUD:
        mat = this.materials.mud;
        break;
      case NodeType.WATER:
        mat = this.materials.water;
        break;
      case NodeType.START:
        mat = this.materials.start;
        break;
      case NodeType.END:
        mat = this.materials.end;
        break;
    }

    const mesh = new THREE.Mesh(this.boxGeometry, mat);
    mesh.scale.set(1, height, 1);
    return mesh;
  }

  public updateCell(r: number, c: number, type: NodeType): void {
    const key = `${r},${c}`;
    const mesh = this.cellMeshes.get(key);
    if (!mesh) return;

    let mat = this.materials.empty;
    const height = this.getCellHeight(type);

    switch (type) {
      case NodeType.WALL:
        mat = this.materials.wall;
        break;
      case NodeType.MUD:
        mat = this.materials.mud;
        break;
      case NodeType.WATER:
        mat = this.materials.water;
        break;
      case NodeType.START:
        mat = this.materials.start;
        break;
      case NodeType.END:
        mat = this.materials.end;
        break;
    }

    mesh.material = mat;
    mesh.scale.set(1, height, 1);
    mesh.position.y = height / 2;
  }

  public markVisited(r: number, c: number): void {
    const mesh = this.cellMeshes.get(`${r},${c}`);
    if (!mesh) return;
    mesh.material = this.materials.visited;
    mesh.scale.set(1, 0.45, 1);
    mesh.position.y = 0.225;
  }

  public renderShortestPath(path: GridCoord[]): void {
    while (this.pathLineGroup.children.length > 0) {
      this.pathLineGroup.remove(this.pathLineGroup.children.pop()!);
    }

    for (const coord of path) {
      const mesh = this.cellMeshes.get(`${coord.r},${coord.c}`);
      if (mesh) {
        mesh.material = this.materials.path;
        mesh.scale.set(1, 0.75, 1);
        mesh.position.y = 0.375;
      }
    }
  }

  public clearPathAndVisited(): void {
    while (this.pathLineGroup.children.length > 0) {
      this.pathLineGroup.remove(this.pathLineGroup.children.pop()!);
    }
  }

  public focusCamera(rows: number, cols: number): void {
    const maxDim = Math.max(rows, cols);
    this.camera.position.set(0, maxDim * 1.3, maxDim * 1.1);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  public setIsometricView(rows: number, cols: number): void {
    const maxDim = Math.max(rows, cols);
    this.camera.position.set(maxDim * 0.95, maxDim * 1.15, maxDim * 0.95);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  public setTopDownView(rows: number, cols: number): void {
    const maxDim = Math.max(rows, cols);
    this.camera.position.set(0, maxDim * 1.8, 0.001);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  public onResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate(): void {
    this.animFrameId = requestAnimationFrame(this.animate);

    // Dynamic rotation of 3D Start/End Beacons
    if (this.endPortalRing) {
      this.endPortalRing.rotation.x += 0.02;
      this.endPortalRing.rotation.y += 0.03;
    }
    if (this.endPortalCrystal) {
      this.endPortalCrystal.rotation.y -= 0.04;
      this.endPortalCrystal.rotation.z += 0.01;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  public destroy(): void {
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
