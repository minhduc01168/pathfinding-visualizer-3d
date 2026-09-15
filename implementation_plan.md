# Kế hoạch Triển khai: PathQuest 2D – Dual-Mode Pathfinding Visualizer & AI Arena

PathQuest 2D là hệ thống ứng dụng web chuyên sâu kết hợp giữa **Phòng nghiên cứu & Đối sánh thuật toán (Lab Benchmark Mode)** và **Đấu trường Game tương tác (Arcade Arena Mode)** để trực quan hóa, đo lường và ứng dụng 3 thuật toán tìm đường kinh điển: **BFS (Breadth-First Search)**, **Dijkstra** và **A\***.

---

## User Review & Quyết định Đã Chốt từ Tony

> [!NOTE]
> **Các quyết định thiết kế cốt lõi đã được Tony phê duyệt:**
> 1. **Cơ chế Lưới có Trọng số (Terrain Weights):** Đã chốt. Lưới hỗ trợ Cỏ (Cost = 1), Bùn lầy (Cost = 5), Vực nước (Cost = 10), Tường chắn (Cost = $\infty$) để làm nổi bật sự khác biệt giữa Dijkstra/A* và BFS.
> 2. **Hiển thị So sánh Lab Mode:** 3 bản đồ con cạnh nhau (Tri-split View: BFS vs Dijkstra vs A*) chạy đua đồng bộ; sau khi chạy xong **giữ nguyên toàn bộ vết sóng duyệt (Visited Wavefront trace) và đường đi tối ưu (Path trail)** để người dùng dễ dàng soi xét, phân tích số liệu.
> 3. **Heuristic A\*:** Sử dụng di chuyển 4 hướng (Up, Down, Left, Right) với hàm khoảng cách **Manhattan Distance** chuẩn mực ($h(n) = |x_1 - x_2| + |y_1 - y_2|$).
> 4. **Đồ họa 3D Sống Động (Three.js Engine):** Nâng cấp đồ họa lên **không gian 3D tương tác**:
>    - Các ô tường là khối lập phương 3D (Voxel Block) nổi lên bề mặt.
>    - Ô bùn lầy/nước có bề mặt lún sâu và màu sắc phản quang.
>    - Sóng duyệt (Wavefront) là các khối năng lượng 3D phát sáng (Neon Pulse) nhấp nhô theo cao độ.
>    - Đường đi tối ưu là dải ánh sáng vàng Gold phát sáng bay lượn trên lưới 3D.
>    - Hỗ trợ xoay camera 360°, phóng to/thu nhỏ (OrbitControls) và nút chuyển nhanh `[ 2D Top-down ] <-> [ 3D Isometric View ]`.
>    - Chế độ Arcade Game 3D: Nhân vật và 3 AI chaser hiển thị dưới dạng 3D Cyberpunk tokens rượt đuổi nhau trong mê cung 3D!

---

## Proposed Changes

Dự án được xây dựng dưới dạng ứng dụng Web hiệu năng cao bằng **Vite + Vanilla TypeScript + HTML5 Canvas** kết hợp giao diện phong cách **Cyberpunk / Sci-Fi Dark UI**.

### 1. Cấu trúc Dự án (Project Scaffold)

#### [NEW] [package.json](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/package.json)
- Khởi tạo dự án Vite + TypeScript.
- Cấu hình scripts: `dev`, `build`, `preview`.

#### [NEW] [index.html](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/index.html)
- Khung cấu trúc HTML5 ngữ nghĩa, nạp Google Fonts (`Outfit`, `JetBrains Mono`).
- Container cho Navigation Bar, Toolbar, Dual Canvas Viewports, Stats Dashboard, và Game HUD.

#### [NEW] [src/styles/theme.css](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/styles/theme.css)
- Hệ thống Design Tokens CSS (Gam màu Cyberpunk: Neon Cyan, Matrix Green, Amber Gold, Crimson Red, Dark Slate Navy).
- Hiệu ứng Glassmorphism, Glow pulse, Box shadows và Typography tokens.

#### [NEW] [src/styles/main.css](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/styles/main.css)
- Bố cục layout lưới, responsive viewports, toolbar buttons, control sliders, modal báo cáo và game overlay.

---

### 2. Lớp Cấu trúc Dữ liệu & Lõi Thuật toán (Core Pathfinding Engine)

Tách biệt hoàn toàn logic tính toán khỏi giao diện đồ họa.

#### [NEW] [src/core/types.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/core/types.ts)
- Định nghĩa kiểu dữ liệu:
  - `NodeType`: `EMPTY`, `WALL`, `START`, `END`, `MUD` (cost 5), `WATER` (cost 10).
  - `GridNode`: Tọa độ $(x, y)$, trọng số `weight`, trạng thái `isVisited`, khoảng cách `gScore`, `fScore`, con trỏ `parent`.
  - `AlgorithmType`: `'bfs' | 'dijkstra' | 'astar'`.
  - `AlgorithmStep`: Bước lan truyền sóng (Wavefront node) để phục vụ diễn hoạt animation.
  - `SearchResult`: Mảng các bước duyệt (`visitedOrder`), đường đi tối ưu (`shortestPath`), thời gian thực thi (`executionTimeMs`), tổng chi phí (`totalCost`).

#### [NEW] [src/core/MinHeap.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/core/MinHeap.ts)
- Cài đặt Hàng đợi ưu tiên (Binary Min-Heap) chuẩn tối ưu $O(\log N)$ phục vụ Dijkstra và A*.

#### [NEW] [src/core/heuristics.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/core/heuristics.ts)
- Cài đặt các hàm khoảng cách Heuristic: Manhattan Distance, Euclidean Distance, Chebyshev Distance.

#### [NEW] [src/core/algorithms/bfs.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/core/algorithms/bfs.ts)
- Thuật toán BFS sử dụng Queue tiêu chuẩn, tìm đường theo số bước tối thiểu.

#### [NEW] [src/core/algorithms/dijkstra.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/core/algorithms/dijkstra.ts)
- Thuật toán Dijkstra trên đồ thị có trọng số sử dụng `MinHeap`, đảm bảo tìm đường có tổng chi phí (cost) nhỏ nhất.

#### [NEW] [src/core/algorithms/astar.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/core/algorithms/astar.ts)
- Thuật toán A* kết hợp chi phí thực tế $g(n)$ và ước lượng Heuristic $h(n)$, rút ngắn tối đa số đỉnh cần duyệt.

#### [NEW] [src/core/maze/mazeGenerators.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/core/maze/mazeGenerators.ts)
- Các thuật toán sinh mê cung và bản đồ chướng ngại vật:
  - **Recursive Backtracking**: Tạo mê cung hoàn hảo với hành lang phức tạp.
  - **Random Obstacles & Terrains**: Sinh ngẫu nhiên tường chắn, vùng đầm lầy và sông ngòi.
  - **Stair / Concentric Patterns**: Bản đồ thử thách khả năng thoát bẫy cực hạn của các thuật toán.

---

### 3. Lớp Trực quan hóa & Tương tác Canvas (Render Engine)

#### [NEW] [src/renderer/GridCanvas.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/renderer/GridCanvas.ts)
- Quản lý vẽ lưới trên HTML5 Canvas để đạt tốc độ 60 FPS mượt mà.
- Xử lý tương tác chuột: Click & Drag vẽ tường/bùn/nước, Kéo thả icon Start / End linh hoạt.
- Hiển thị bước sóng:
  - *Frontier / OpenSet*: Viền phát sáng neon mở rộng.
  - *Visited / ClosedSet*: Hiệu ứng gradient quét radar từ nhạt đến đậm.
  - *Shortest Path*: Đường sáng vàng Gold phát sáng chạy từ Start đến End.

#### [NEW] [src/renderer/AnimationController.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/renderer/AnimationController.ts)
- Điều khiển tiến trình diễn hoạt: Play, Pause, Resume, Reset, Step Forward, Step Backward.
- Thanh trượt tốc độ (`Speed Multiplier`: 0.5x, 1x, 2x, 5x, Instant).

---

### 4. Bảng Thống kê & Báo cáo Đối chiếu (Lab Dashboard)

#### [NEW] [src/components/Dashboard.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/components/Dashboard.ts)
- Cập nhật số liệu thời gian thực cho 3 thuật toán:
  - ⏱️ **Thời gian thực thi (Execution Time):** Độ chính xác microsecond (`performance.now()`).
  - 🧭 **Số đỉnh đã duyệt (Visited Nodes):** Tỉ lệ % bản đồ đã bị quét qua.
  - 📏 **Độ dài đường đi (Path Length) & Chi phí (Total Cost):** Đánh giá chất lượng đường đi.
- **Tự động đưa ra kết luận thông minh (Automated Verdict):**
  - Ví dụ: *"A\* tìm ra đường đi ngắn nhất với số đỉnh duyệt ít hơn BFS 74.2% và thời gian tính toán nhanh hơn 3.8 lần."*

---

### 5. Đấu trường Trò chơi (Arcade Arena Mode: "AI Dungeon Chase")

#### [NEW] [src/game/GameEngine.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/game/GameEngine.ts)
- Game Loop 60 FPS quản lý vòng đời game: Init, Start, Tick, Render, GameOver/Victory.
- Quản lý trạng thái: Điểm số, Máu người chơi (HP), Năng lượng/Số lượng vật cản có thể đặt.

#### [NEW] [src/game/Entities.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/game/Entities.ts)
- `Player`: Di chuyển bằng phím mũi tên hoặc `WASD`, nhặt pin năng lượng để mở khóa cổng không gian (Exit Portal).
- `EnemyNPC`:
  - 🟢 **Blinky (BFS Drone):** Quét toàn bộ mê cung tìm người chơi, không quan tâm bùn lầy.
  - 🔵 **Inky (Dijkstra Tank):** Luôn tìm đường né tránh bẫy gai/bùn lầy mà người chơi đặt xuống.
  - 🔴 **Shadow (A\* Hunter):** Thợ săn tính toán chính xác hướng người chơi, bám đuôi quyết liệt nhất.
- Khả năng tương tác thời gian thực: Người chơi bấm `Space` hoặc click chuột để thả bẫy chướng ngại vật cản đường, ép các AI phải lập tức re-calculate đường đi theo thời gian thực!

---

### 6. Điểm điều phối ứng dụng (Application Orchestrator)

#### [NEW] [src/main.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/main.ts)
- Khởi tạo và gắn kết State Management, Toolbar Controller, Lab Mode Controller và Game Mode Controller.

---

## Verification Plan

### Automated Tests
1. **Kiểm thử Thuật toán Cơ sở (Unit Tests):**
   - Đảm bảo BFS, Dijkstra, A* tìm được đường đi đúng trên lưới trống không có vật cản.
   - Đảm bảo xử lý chuẩn mực trường hợp không có đường đi (Đích bị bao vây kín bởi tường đá) -> Trả về `path = null` mà không bị treo lặp vô tận.
   - Kiểm thử tính đúng đắn của `MinHeap`: Thao tác push/pop giữ đúng invariant heap nhỏ nhất.
   - Kiểm thử trọng số: Chứng minh trên lưới có bùn lầy (cost 5), Dijkstra và A* đi vòng qua đường bằng (cost 1+1+1=3), trong khi BFS vẫn đâm thẳng qua bùn lầy.
2. **Kiểm thử Sinh Mê Cung:**
   - Đảm bảo thuật toán sinh mê cung tạo ra đồ thị hợp lệ, không ghi đè mất vị trí Start và End.

### Manual Verification
1. **Kiểm thử Tương tác Lưới (Lab Mode):**
   - Dùng chuột vẽ tường liên tục xem có mượt mà không, kéo đổi vị trí Start/End xem đường đi có cập nhật tức thời không.
   - Thử nghiệm các tốc độ animation (chậm, nhanh, tức thì) và thử bấm nút Pause/Resume.
   - Thử chế độ so sánh 3 thuật toán (Tri-Split Race) xem bảng số liệu thống kê có hiển thị chính xác kết quả của từng thuật toán không.
2. **Kiểm thử Chơi Game (Arcade Mode):**
   - Bật Game Mode, điều khiển nhân vật bằng `WASD`, quan sát 3 AI di chuyển săn lùng.
   - Thử đặt chướng ngại vật ngay trước mặt AI A* để kiểm tra tính năng re-pathing động.
   - Thu thập đủ chìa khóa và bước vào Cổng Thoát (Portal) để kiểm tra trạng thái Chiến thắng (Victory).
