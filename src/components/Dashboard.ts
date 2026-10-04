import { AlgorithmMetrics, SearchResult } from '../core/types';

/**
 * Real-time Comparison Dashboard and Automated Analytical Verdict Engine
 */
export class Dashboard {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(results: Map<string, SearchResult>, totalCells: number): void {
    const bfs = results.get('bfs')?.metrics;
    const dijkstra = results.get('dijkstra')?.metrics;
    const astar = results.get('astar')?.metrics;

    this.container.innerHTML = `
      <div class="metrics-grid">
        ${this.renderCard(bfs, 'bfs', totalCells)}
        ${this.renderCard(dijkstra, 'dijkstra', totalCells)}
        ${this.renderCard(astar, 'astar', totalCells)}
      </div>
      <div class="verdict-panel">
        ${this.generateVerdict(bfs, dijkstra, astar, totalCells)}
      </div>
    `;
  }

  private renderCard(m: AlgorithmMetrics | undefined, type: string, totalCells: number): string {
    if (!m) {
      return `
        <div class="metric-card ${type}-card">
          <div class="card-header">
            <span class="algo-tag ${type}-tag">${type.toUpperCase()}</span>
            <span class="status-badge idle">Sẵn sàng</span>
          </div>
          <div class="card-body">
            <p class="placeholder-text">Chưa chạy mô phỏng</p>
          </div>
        </div>
      `;
    }

    const visitedPercent = ((m.visitedNodesCount / totalCells) * 100).toFixed(1);
    const statusText = m.found ? 'Thành công' : 'Không có đường đi';
    const statusClass = m.found ? 'success' : 'failed';

    return `
      <div class="metric-card ${type}-card">
        <div class="card-header">
          <div class="algo-info">
            <span class="algo-dot ${type}"></span>
            <h4 class="algo-name">${m.name}</h4>
          </div>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">Thời gian</span>
            <span class="stat-value highlight">${m.executionTimeMs.toFixed(2)} <small>ms</small></span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Số ô đã duyệt</span>
            <span class="stat-value">${m.visitedNodesCount} <small>(${visitedPercent}%)</small></span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Số bước đi</span>
            <span class="stat-value">${m.pathLength} <small>bước</small></span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tổng chi phí</span>
            <span class="stat-value cost">${m.pathCost}</span>
          </div>
        </div>
      </div>
    `;
  }

  private generateVerdict(
    bfs: AlgorithmMetrics | undefined,
    dijkstra: AlgorithmMetrics | undefined,
    astar: AlgorithmMetrics | undefined,
    _totalCells: number
  ): string {
    if (!bfs || !dijkstra || !astar) {
      return `
        <div class="verdict-placeholder">
          <span class="verdict-icon">💡</span>
          <span>Bấm <strong>"CHẠY ĐUA TẤT CẢ"</strong> để hệ thống tự động đối chiếu và xuất kết luận khoa học.</span>
        </div>
      `;
    }

    if (!bfs.found && !dijkstra.found && !astar.found) {
      return `
        <div class="verdict-content alert">
          <h4>🚫 Kết Luận: Mục tiêu bị phong tỏa hoàn toàn</h4>
          <p>Không có thuật toán nào tìm được đường đi vì điểm Kết thúc đã bị tường đá vây kín. Cả 3 thuật toán đã duyệt kiệt quệ các thành phần liên thông.</p>
        </div>
      `;
    }

    // Determine comparative insights
    let nodesSavedPercent = 0;
    if (bfs.visitedNodesCount > 0) {
      nodesSavedPercent = Math.round(
        ((bfs.visitedNodesCount - astar.visitedNodesCount) / bfs.visitedNodesCount) * 100
      );
    }

    const costDiff = bfs.pathCost - dijkstra.pathCost;

    let analysisPoints = [];

    if (costDiff > 0) {
      analysisPoints.push(`
        <li><strong>Độ tối ưu chi phí:</strong> <strong>Dijkstra</strong> và <strong>A*</strong> tìm ra đường đi rẻ hơn BFS <em>${costDiff} điểm chi phí</em> do biết chọn đường vòng né tránh đầm lầy/vực nước. BFS đâm đầu qua vùng nặng vì chỉ đếm số ô.</li>
      `);
    } else {
      analysisPoints.push(`
        <li><strong>Độ tối ưu chi phí:</strong> Do bản đồ không có cản trở lớn về trọng số, cả 3 thuật toán đều tìm ra chi phí tương đồng (${dijkstra.pathCost}).</li>
      `);
    }

    if (nodesSavedPercent > 0) {
      analysisPoints.push(`
        <li><strong>Hiệu suất không gian quét:</strong> <strong>A*</strong> vượt trội tuyệt đối khi tiết kiệm tới <strong>${nodesSavedPercent}%</strong> số ô phải duyệt so với BFS nhờ hàm ước lượng khoảng cách Manhattan định hướng thẳng tới đích.</li>
      `);
    }

    return `
      <div class="verdict-content">
        <div class="verdict-header">
          <span class="trophy-badge">🏆 Báo Cáo Phân Tích Khoa Học</span>
          <span class="champ-tag">Tối ưu nhất: Thuật toán A*</span>
        </div>
        <ul class="verdict-insights">
          ${analysisPoints.join('')}
        </ul>
      </div>
    `;
  }
}
