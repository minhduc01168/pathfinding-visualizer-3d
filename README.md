# 🚀 PathQuest 2D/3D (Pro Edition)
### Dual-Mode Pathfinding Visualizer & AI Arena

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.12-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160.0-black.svg?logo=three.js)](https://threejs.org/)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas%202D-E34F26.svg?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **PathQuest 2D/3D** là nền tảng web tương tác hiệu năng cao kết hợp giữa **Phòng nghiên cứu & Đối sánh thuật toán (Lab Benchmark Mode)** và **Đấu trường Game 3D thực chiến (Arcade Arena Mode)** để trực quan hóa, đo lường và ứng dụng 3 thuật toán tìm đường kinh điển: **BFS (Breadth-First Search)**, **Dijkstra** và **A\*** trong không gian 2D & 3D Voxel.

---

## 📑 Mục Lục

- [✨ Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
  - [🔬 1. Phân hệ Lab Benchmark (Đối sánh khoa học)](#1-phân-hệ-lab-benchmark-đối-sánh-khoa-học)
  - [🧊 2. Tầng Đồ Họa 3D Voxel (Three.js WebGL)](#2-tầng-đồ-họa-3d-voxel-threejs-webgl)
  - [🎮 3. Phân hệ Arcade Arena 3D (Đấu trường AI Chase)](#3-phân-hệ-arcade-arena-3d-đấu-trường-ai-chase)
  - [🎨 4. Giao diện Kép: Cyber Aurora & Crisp Light](#4-giao-diện-kép-cyber-aurora--crisp-light)
- [📊 Bảng So Sánh Thuật Toán & Độ Phức Tạp](#-bảng-so-sánh-thuật-toán--độ-phức-tạp)
- [🏛️ Kiến Trúc Hệ Thống (Decoupled 4-Layer)](#️-kiến-trúc-hệ-thống-decoupled-4-layer)
- [📂 Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [⚡ Hướng Dẫn Cài Đặt & Chạy Dự Án](#-hướng-dẫn-cài-đặt--chạy-dự-án)
- [🎮 Hướng Dẫn Phím Điều Khiển](#-hướng-dẫn-phím-điều-khiển)
- [📄 Giấy Phép (License)](#-giấy-phép-license)

---

## ✨ Tính Năng Nổi Bật

### 1. Phân hệ Lab Benchmark (Đối sánh khoa học)
* **Bản Đồ Tương Tác Master (Interactive Grid Canvas):**
  * Tự do vẽ và chỉnh sửa địa hình bằng chuột: **🧱 Tường chắn** (Cost = $\infty$), **🟤 Bùn lầy** (Cost = 5), **💧 Vực nước** (Cost = 10).
  * Kéo thả hoặc đặt lại vị trí xuất phát (**Start Pin**) và đích đến (**End Pin**).
  * Hỗ trợ 3 kích thước lưới: `25 × 15` (Nhỏ), `35 × 21` (Tiêu chuẩn), `50 × 30` (Lớn).
* **Sinh Địa Hình & Mê Cung Thủ Tục (Procedural Generators):**
  * **Recursive Backtracking:** Mê cung hoàn hảo với mê lộ hành lang sâu và nhiều ngõ cụt.
  * **Random Terrains:** Phân bổ ngẫu nhiên vật cản và bãi lầy.
  * **Weight Traps (Bẫy Trọng Số):** Tình huống thực nghiệm chứng minh A* và Dijkstra biết đi vòng đường bằng để tối ưu chi phí, trong khi BFS đâm đầu qua đầm lầy.
* **Chạy Đua Đồng Bộ (Tri-Split Lockstep Race):**
  * 3 màn hình đồ họa con đặt cạnh nhau chạy đua song song: **BFS vs Dijkstra vs A\***.
  * **Lưu vết vĩnh viễn (Trace Retention):** Sau khi hoàn thành, toàn bộ vết sóng quét (Wavefront Heatmap) và đường đi ngắn nhất (Golden Path) được giữ nguyên trạng thái giúp người dùng phân tích, soi xét từng ngóc ngách.
* **Bảng Đo Lường Vi Sai & Kết Luận Khoa Học Tự Động (Telemetry Dashboard):**
  * Đo thời gian thực thi chính xác đến microsecond (`performance.now()`).
  * Đo lường: Số đỉnh đã duyệt (Visited Nodes), Độ dài đường đi (Steps), Tổng chi phí trọng số (Total Cost).
  * Đưa ra kết luận so sánh tự động (Automated Verdict) phân tích thuật toán tối ưu nhất theo từng ngữ cảnh.

---

### 2. Tầng Đồ Họa 3D Voxel (Three.js WebGL)
* **Không Gian Voxel Sống Động:**
  * Các ô tường là khối lập phương 3D nổi bật (`MeshStandardMaterial`).
  * Ô đầm lầy và vực nước có cao độ lõm sâu với độ phản xạ bề mặt chân thực.
  * Sóng duyệt và đường đi tối ưu phát ánh sáng dạ quang Neon rực rỡ.
* **Điều Khiển Camera Tự Do:**
  * Tích hợp `OrbitControls`: Xoay 360°, phóng to/thu nhỏ (Zoom), dịch chuyển góc nhìn (Pan).
  * Nút chuyển nhanh: **[ Isometric View (3D Chéo) ]** $\longleftrightarrow$ **[ Top-Down View (Nhìn từ trên) ]**.

---

### 3. Phân hệ Arcade Arena 3D (Đấu trường AI Chase)
* **Vòng Lặp Game 60 FPS Thực Chiến:**
  * Người chơi điều khiển **Cyber Runner** trong mê cung 3D.
  * Mục tiêu: Thu thập đủ **3 Chìa khóa năng lượng (Energy Crystals)** và nhanh chóng thoát qua **Cổng Không Gian Xanh (Exit Portal)**.
* **3 Quái Thú AI Săn Lùng Độc Bản (The AI Hunters):**
  * 🟢 **Blinky (BFS Drone):** Quét toàn bộ mê cung, càn quét bất chấp bùn lầy. Dễ bị dụ vào hành lang dài.
  * 🔵 **Inky (Dijkstra Tank):** Cực kỳ cẩn trọng. Luôn tìm đường tránh xa các bẫy bùn lầy có chi phí cao.
  * 🔴 **Shadow (A\* Hunter):** Thợ săn nguy hiểm nhất với nhịp ra quyết định nhanh gấp đôi! Luôn định hướng thẳng đến vị trí người chơi bằng Heuristic Manhattan.
* **Cơ Chế Giăng Bẫy Thời Gian Thực (Dynamic Re-routing):**
  * Nhấn `SPACE` để giăng bẫy bùn lầy ngay sau lưng.
  * Ngay khi đồ thị trọng số thay đổi, các AI lập tức tính toán lại đường đi (Re-pathfinding) tức thì theo thời gian thực!

---

### 4. Giao diện Kép: Cyber Aurora & Crisp Light
* 🌙 **Cyber Aurora (Tối dạ quang):** Phong cách Cyberpunk với dải màu Neon Cyan, Matrix Green, Amber Gold, Crimson Red trên nền Dark Slate Navy sâu thẳm.
* ☀️ **Crisp Light (Sáng hiện đại):** Nền trắng tuyết chuẩn phòng lab nghiên cứu, độ tương phản cao, trực quan và dịu mắt.

---

## 📊 Bảng So Sánh Thuật Toán & Độ Phức Tạp

| Tiêu Chí | BFS (Breadth-First Search) | Dijkstra | A\* (A-Star) |
| :--- | :---: | :---: | :---: |
| **Cấu trúc dữ liệu** | FIFO Queue | Binary Min-Heap | Binary Min-Heap |
| **Hàm đánh giá** | Không có (chỉ xét level) | $f(n) = g(n)$ | $f(n) = g(n) + h(n)$ |
| **Heuristic Function** | Không | Không | Manhattan: $\|x_1-x_2\| + \|y_1-y_2\|$ |
| **Độ phức tạp thời gian** | $\mathcal{O}(V + E)$ | $\mathcal{O}((V + E) \log V)$ | $\mathcal{O}(E)$ (tốt nhất) đến $\mathcal{O}((V + E) \log V)$ |
| **Độ phức tạp không gian** | $\mathcal{O}(V)$ | $\mathcal{O}(V)$ | $\mathcal{O}(V)$ |
| **Hỗ trợ trọng số** | ❌ Không (chỉ tối ưu số bước) | ✅ Có (tối ưu tổng chi phí) | ✅ Có (tối ưu tổng chi phí) |
| **Hình thái sóng duyệt** | Lan tỏa hình tròn/kim cương đều | Lan tỏa theo đường chi phí thấp | Bóp dẹp hình elip hướng về đích |
| **Tính tối ưu (Optimality)** | Tối ưu trên đồ thị không trọng số | Luôn đảm bảo đường chi phí thấp nhất | Luôn đảm bảo đường chi phí thấp nhất (với Heuristic hợp lệ) |

---

## 🏛️ Kiến Trúc Hệ Thống (Decoupled 4-Layer)

Dự án tuân thủ nghiêm ngặt nguyên lý thiết kế phân tầng độc lập (Decoupled Architecture):

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. PRESENTATION & UX LAYER                                             │
│    index.html • theme.css • main.css • Toolbar • Dashboard             │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. APPLICATION ORCHESTRATOR & STATE LAYER                              │
│    main.ts (Global State Manager, Mode Switcher, Event Hub)            │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌─────────────────────────────────────┐  ┌───────────────────────────────┐
│ 3. CORE ALGORITHMS & MATH ENGINE    │  │ 4. DUAL RENDERING PIPELINE    │
│    • BFS, Dijkstra, A* Engine       │  │    • GridCanvas2D (HTML5 DPI) │
│    • Heuristics (Manhattan)         │  │    • TriSplitView (Lockstep)  │
│    • Binary Min-Heap Priority Queue │  │    • ThreeEngine (WebGL 3D)   │
│    • Procedural Maze Generators     │  │    • GameEngine3D (60 FPS)    │
└─────────────────────────────────────┘  └───────────────────────────────┘
```

---

## 📂 Cấu Trúc Thư Mục

```
pathquest-2d-3d/
├── .github/
│   └── workflows/
│       └── ci.yml                      # Tự động kiểm tra TypeCheck & Build trên GitHub Actions
├── docs/                               # Tài liệu thiết kế & cẩm nang chi tiết
│   ├── 01_SYSTEM_ARCHITECTURE.md       # Kiến trúc hệ thống & data flow
│   ├── 02_ALGORITHMS_AND_BENCHMARKS.md # Đối sánh thuật toán & dữ liệu thực nghiệm
│   ├── 03_USER_AND_GAME_GUIDE.md       # Cẩm nang người dùng & hướng dẫn chơi game
│   └── 04_TECHNICAL_SPECS_AND_API.md   # Đặc tả kỹ thuật & API nội bộ
├── src/
│   ├── components/
│   │   └── Dashboard.ts                # Bảng thống kê telemetry & verdict engine
│   ├── core/                           # Lõi thuật toán độc lập nền tảng
│   │   ├── algorithms/
│   │   │   ├── astar.ts                # Thuật toán A* với Min-Heap & Heuristic
│   │   │   ├── bfs.ts                  # Thuật toán BFS với Queue tiêu chuẩn
│   │   │   └── dijkstra.ts             # Thuật toán Dijkstra trên đồ thị trọng số
│   │   ├── maze/
│   │   │   └── mazeGenerators.ts       # Sinh mê cung (Recursive Backtracker, Traps)
│   │   ├── heuristics.ts               # Các hàm khoảng cách Manhattan, Euclidean
│   │   ├── MinHeap.ts                  # Hàng đợi ưu tiên Binary Min-Heap
│   │   └── types.ts                    # TypeScript Interfaces & Enums
│   ├── game/
│   │   └── GameEngine3D.ts             # Vòng lặp game 3D, AI NPCs & bẫy động
│   ├── renderer/
│   │   ├── GridCanvas2D.ts             # Canvas 2D DPI-Scaled & Trace Retention
│   │   ├── ThreeEngine.ts              # Đồ họa 3D Voxel với Three.js WebGL
│   │   └── TriSplitView.ts             # Quản lý 3 canvas so sánh song song
│   ├── styles/
│   │   ├── main.css                    # Bố cục layout, glassmorphism, responsive
│   │   └── theme.css                   # Cyber Aurora & Crisp Light tokens
│   └── main.ts                         # Điểm điều phối ứng dụng trung tâm
├── .gitignore                          # Cấu hình bỏ qua file rác, dependencies & agent folders
├── index.html                          # Khung HTML5 ngữ nghĩa
├── LICENSE                             # Giấy phép nguồn mở MIT
├── package.json                        # Cấu hình npm & dependencies
├── README.md                           # Giới thiệu & hướng dẫn tổng quan
├── tsconfig.json                       # Cấu hình TypeScript Strict Mode
└── vite.config.ts                      # Cấu hình máy chủ phát triển Vite
```

---

## ⚡ Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Môi Trường
* **Node.js**: Phiên bản 18.0.0 trở lên (khuyên dùng Node 20 LTS).
* **Trình quản lý gói**: `npm` (đi kèm Node.js) hoặc `pnpm` / `yarn`.
* **Trình duyệt**: Bất kỳ trình duyệt nào hỗ trợ WebGL & HTML5 Canvas (Chrome, Edge, Firefox, Safari, Brave).

### Các Bước Triển Khai

1. **Clone kho mã nguồn về máy:**
   ```bash
   git clone https://github.com/<your-username>/pathquest-2d-3d.git
   cd pathquest-2d-3d
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies):**
   ```bash
   npm install
   ```

3. **Khởi động máy chủ phát triển (Dev Server):**
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại địa chỉ: `http://localhost:5173/` để trải nghiệm ứng dụng!

4. **Kiểm tra TypeScript & Đóng gói sản phẩm (Production Build):**
   ```bash
   npm run build
   ```

5. **Chạy thử bản đóng gói (Preview Production):**
   ```bash
   npm run preview
   ```

---

## 🎮 Hướng Dẫn Phím Điều Khiển

### Trong Phân Hệ Lab Benchmark
* **Chuột trái (Giữ & Kéo):** Vẽ tường, bùn lầy, nước hoặc xóa vật cản tùy theo bút vẽ đang chọn.
* **Click vào Start/End Pin:** Dời điểm xuất phát `S` hoặc điểm đích `E`.
* **Cửa sổ 3D Voxel:**
  * **Chuột trái (Kéo):** Xoay tự do 360° quanh tâm bản đồ.
  * **Cuộn chuột (Scroll):** Phóng to / Thu nhỏ (Zoom In / Out).
  * **Chuột phải (Kéo):** Di chuyển góc nhìn (Pan).

### Trong Phân Hệ Arcade Arena 3D (AI Chase)
* **`W`, `A`, `S`, `D`** hoặc **`▲`, `▼`, `◄`, `►`**: Di chuyển nhân vật Runner theo 4 hướng.
* **`SPACE` (Phím cách)**: Giăng bẫy bùn lầy ngay tại vị trí hiện tại (Tối đa 5 bẫy) để chặn đường và ép AI đổi hướng.
* **Nút "Chơi lại Game"**: Tạo ngẫu nhiên một đấu trường mới và bắt đầu màn chơi.

---

## 📄 Giấy Phép (License)

Dự án được phát hành theo giấy phép **[MIT License](LICENSE)**. Bạn hoàn toàn có quyền sử dụng, chỉnh sửa và phân phối cho mục đích học tập, nghiên cứu và thương mại.
