# 04. Đặc Tả Kỹ Thuật & Hướng Dẫn Lập Trình Mở Rộng (Technical Specs & API Reference)

> **Dự án:** PathQuest 2D/3D (Pro Edition)  
> **Ngôn ngữ:** TypeScript 5.2+ / ES2020  
> **Công nghệ lõi:** Vite 5, Three.js 0.160, HTML5 Canvas API  

---

## 1. Cấu Trúc Dữ Liệu Cốt Lõi (Core Data Structures)

### 1.1. `NodeType` & `NODE_COSTS` (`src/core/types.ts`)
```typescript
export enum NodeType {
  EMPTY = 'empty',   // Ô cỏ bình thường
  WALL = 'wall',     // Tường chắn không thể đi qua
  START = 'start',   // Điểm bắt đầu
  END = 'end',       // Đích đến
  MUD = 'mud',       // Đầm lầy (Trọng số 5)
  WATER = 'water'    // Vực nước (Trọng số 10)
}

export const NODE_COSTS: Record<NodeType, number> = {
  [NodeType.EMPTY]: 1,
  [NodeType.WALL]: Infinity,
  [NodeType.START]: 1,
  [NodeType.END]: 1,
  [NodeType.MUD]: 5,
  [NodeType.WATER]: 10
};
```

### 1.2. `GridNode` (`src/core/types.ts`)
Đại diện cho một nút trong không gian đồ thị tìm kiếm:
```typescript
export interface GridNode {
  r: number;                // Chỉ số hàng (Row index)
  c: number;                // Chỉ số cột (Column index)
  type: NodeType;           // Loại địa hình ô
  cost: number;             // Chi phí di chuyển qua ô
  gScore: number;           // Chi phí tích lũy từ Start đến ô này
  fScore: number;           // Tổng chi phí ước lượng (f = g + h)
  hScore: number;           // Chi phí ước lượng đến đích (Heuristic)
  isVisited: boolean;       // Trạng thái đã duyệt (Closed Set)
  parent: GridNode | null;  // Con trỏ nút cha để truy vết đường đi
}
```

### 1.3. `SearchResult` & `AlgorithmMetrics` (`src/core/types.ts`)
```typescript
export interface AlgorithmMetrics {
  algorithm: 'bfs' | 'dijkstra' | 'astar';
  name: string;             // Tên hiển thị đầy đủ
  executionTimeMs: number;  // Thời gian thực thi (mili-giây)
  visitedNodesCount: number;// Tổng số đỉnh đã thăm
  pathLength: number;       // Số bước đi (Hop count)
  pathCost: number;         // Tổng chi phí đường đi (Tổng weight)
  found: boolean;           // Tìm thấy đường đi hay không
}

export interface SearchResult {
  algorithm: 'bfs' | 'dijkstra' | 'astar';
  visitedOrder: GridCoord[]; // Thứ tự các đỉnh được duyệt để vẽ animation
  shortestPath: GridCoord[]; // Mảng tọa độ đường đi tối ưu từ Start đến End
  metrics: AlgorithmMetrics; // Bộ số liệu thống kê
}
```

---

## 2. Hàng Đợi Ưu Tiên Chuẩn Hóa (`MinHeap<T>`)

File: `src/core/MinHeap.ts`  
Cài đặt cấu trúc Binary Min-Heap tối ưu hiệu năng cho Dijkstra và A*:
```typescript
export class MinHeap<T> {
  push(data: T, score: number): void;   // Đưa phần tử vào Heap O(log N)
  pop(): T | undefined;                // Lấy phần tử có score nhỏ nhất O(log N)
  peek(): T | undefined;               // Xem phần tử nhỏ nhất O(1)
  isEmpty(): boolean;                  // Kiểm tra rỗng O(1)
  clear(): void;                       // Làm rỗng Heap
}
```

---

## 3. Các Hàm Heuristic (`src/core/heuristics.ts`)

```typescript
// Hàm Manhattan Distance (Chuẩn cho chuyển động 4 hướng: Lên, Xuống, Trái, Phải)
export function manhattanDistance(a: GridCoord, b: GridCoord): number {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

// Hàm Euclidean Distance (Dùng khi hỗ trợ chuyển động tự do hoặc 8 hướng)
export function euclideanDistance(a: GridCoord, b: GridCoord): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.c - b.c) ** 2);
}
```

---

## 4. Hướng Dẫn Cài Đặt, Chạy & Đóng Gói (Developer Quickstart)

### 4.1. Khởi động Môi trường Phát triển
```bash
# Khởi động máy chủ phát triển Vite tại cổng 5174
npm run dev
# Hoặc với RTK
rtk npm run dev
```

### 4.2. Kiểm tra Kiểu Dữ liệu (Type Checking)
```bash
# Chạy trình biên dịch TypeScript không sinh file để kiểm tra lỗi kiểu
npm run build
# Hoặc
rtk npx tsc --noEmit
```

### 4.3. Đóng Gói Production (Production Bundle)
```bash
npm run build
```
Kết quả đóng gói nằm trong thư mục `dist/` bao gồm mã nguồn thu nhỏ (Minified) và tài nguyên tối ưu sẵn sàng triển khai lên Vercel, Netlify hoặc GitHub Pages.

---

## 5. Hướng Dẫn Mở Rộng Thuật Toán Mới (Extensibility Guide)

Hệ thống được thiết kế mở (Open-Closed Principle). Để bổ sung một thuật toán mới (ví dụ: **Greedy Best-First Search** hoặc **Bidirectional A\***):

1. **Tạo hàm thực thi:** Tạo tệp `src/core/algorithms/greedy.ts`:
   ```typescript
   export function runGreedyBestFirst(
     grid: GridNode[][],
     start: GridCoord,
     end: GridCoord
   ): SearchResult {
     // Cài đặt logic ưu tiên f(n) = h(n)
   }
   ```
2. **Khai báo kiểu:** Bổ sung `'greedy'` vào kiểu union `AlgorithmType` trong `src/core/types.ts`.
3. **Đăng ký vào Bộ So Sánh:** Cập nhật `src/renderer/TriSplitView.ts` hoặc tạo màn hình so sánh mở rộng để tích hợp thuật toán mới vào cuộc đua!
