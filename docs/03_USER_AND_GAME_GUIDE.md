# 03. Cẩm Nang Sử Dụng & Hướng Dẫn Đấu Trường Game (User & Game Manual)

> **Dự án:** PathQuest 2D/3D (Pro Edition)  
> **Nền tảng:** Ứng dụng Web tương tác trên mọi trình duyệt hiện đại  

---

## 1. Hướng Dẫn Phân Hệ Lab Benchmark (Phòng Thí Nghiệm So Sánh)

Phân hệ Lab Benchmark cho phép người dùng tùy ý thiết kế địa hình, kích hoạt chạy đua 3 thuật toán song song và soi xét vết sóng duyệt được lưu lại vĩnh viễn.

### 1.1. Thanh Điều Khiển Đầu Trang (Header Controls)
* **Nút Chuyển Giao Diện (Theme Toggle):**
  - Bấm vào biểu tượng `☀️ Chế Độ Sáng` / `🌙 Chế Độ Tối` để chuyển đổi tức thì giữa 2 phong cách giao diện:
    - **Cyber Aurora (Tối dạ quang):** Nền không gian sâu thẳm, các khối ô phát sáng rực rỡ phong cách tương lai.
    - **Crisp Light (Sáng hiện đại):** Nền trắng tuyết thanh lịch chuẩn phòng lab nghiên cứu, độ tương phản cao, dịu mắt.
* **Lựa chọn Kích thước Lưới (Grid Preset):**
  - `25 × 15 (Nhỏ)`: Phù hợp cho màn hình điện thoại hoặc máy tính bảng.
  - `35 × 21 (Tiêu chuẩn)`: Tối ưu cho màn hình Laptop và Desktop.
  - `50 × 30 (Lớn)`: Khảo sát độ phức tạp cao, quan sát rõ nét chênh lệch thuật toán trên diện rộng.

---

### 1.2. Hộp Công Cụ Vẽ (Brush Palette)
Chọn công cụ và nhấp / kéo chuột trên bảng **"Bản Đồ Tương Tác" (Master Board)**:
* **🧱 Tường (Walls):** Vật cản không thể xuyên qua (Chi phí = $\infty$).
* **🟤 Bùn (+5):** Vùng lầy lội làm chậm di chuyển, chi phí gấp 5 lần đường thường.
* **💧 Nước (+10):** Vùng sông ngòi sâu, chi phí gấp 10 lần đường thường.
* **🟢 Điểm Bắt đầu (Start Pin):** Nhấp vào ô bất kỳ để dời điểm xuất phát (Ký hiệu `S`).
* **🔴 Đích đến (End Pin):** Nhấp vào ô bất kỳ để dời điểm đích (Ký hiệu `E`).
* **🧹 Tẩy (Eraser):** Xóa các vật cản hoặc địa hình để trở về ô cỏ trống.

---

### 1.3. Bộ Sinh Địa Hình Thủ Tục (Procedural Generators)
* **Mê cung hành lang (Recursive Backtracking):** Sinh mê cung hoàn hảo với hành lang dài và ngõ cụt hiểm trở.
* **Địa hình ngẫu nhiên (Random):** Rải ngẫu nhiên các khối tường, vũng bùn và sông hồ.
* **Bẫy đầm lầy (Weight Trap):** Tạo tình huống điển hình với bãi bùn dày chặn ngang lối thẳng, minh chứng A* và Dijkstra biết đi vòng né bẫy trong khi BFS đâm đầu qua đầm lầy.

---

### 1.4. Chạy Đua Song Song & Đọc Bảng Số Liệu
* **Nút "Chạy Đua (Race All)":** 
  - Kích hoạt cả 3 thuật toán BFS, Dijkstra và A* chạy đua đồng bộ.
  - Quan sát bước sóng mở rộng theo thời gian thực:
    - *Xanh Cyan:* Sóng lan truyền của BFS và Dijkstra.
    - *Tím / Xanh Navy:* Các đỉnh đã xét (Visited Set).
    - *Vàng Gold phát sáng:* Con đường ngắn nhất tối ưu từ Start đến End.
* **Lưu vết (Trace Retention):** Sau khi hoàn thành, toàn bộ vết quét và đường đi vàng tiếp tục được lưu giữ nguyên trạng trên 3 bản đồ con để Tony soi xét chi tiết từng ngóc ngách!
* **Khám phá 3D Voxel (Nút "🧊 Khám Phá 3D Voxel"):**
  - Mở ra cửa sổ 3D toàn cảnh không gian Voxel.
  - Giữ chuột trái để **xoay 360°**, cuộn chuột để **phóng to / thu nhỏ**, giữ chuột phải để **di chuyển góc nhìn (Pan)**.
  - Có sẵn các nút bấm chuyển nhanh: *Góc Isometric (3D chéo)*, *Góc Top-Down (nhìn thẳng từ trên)*.

---

## 2. Hướng Dẫn Đấu Trường Game 3D ("Arcade Arena: AI Chase")

Bấm tab **"🎮 Arcade Arena 3D (AI Chase)"** trên thanh Header để bước vào thế giới sinh tồn thực chiến!

### 2.1. Mục Tiêu Trò Chơi
Bạn điều khiển một khối ngọc năng lượng (Cyber Runner) bị lạc trong mê cung 3D. Bạn phải:
1. Thu thập đủ **3 Chìa khóa vàng (Energy Crystals)** rải rác khắp mê cung.
2. Nhanh chóng di chuyển đến **Cổng Không Gian Xanh (Exit Portal)** ở góc đối diện để trốn thoát!

---

### 2.2. Phím Điều Khiển
* **Di chuyển:** Sử dụng các phím mũi tên `▲ ▼ ◄ ►` hoặc cụm phím `W`, `A`, `S`, `D`.
* **Giăng Bẫy Bùn Cản Đường:** Bấm phím `SPACE (Phím cách)`.
  - Bạn có sẵn **5 lượt giăng bẫy**.
  - Khi đặt bẫy, ô đất ngay vị trí của bạn biến thành đầm lầy, làm biến đổi đồ thị trọng số của mê cung ngay tức khắc!

---

### 2.3. Nhận Diện 3 Quái Vật AI Săn Lùng (The AI Hunters)
* 🟢 **Blinky (BFS AI - Quái Cầu Xanh Lá):**
  - Di chuyển càn quét, không quan tâm đến bẫy bùn mà bạn giăng ra. Rất dễ bị dắt mũi quanh các hành lang dài.
* 🔵 **Inky (Dijkstra AI - Cỗ Xe Khối Vuông Xanh Dương):**
  - Cực kỳ thông minh và cẩn trọng. Khi bạn bấm `SPACE` giăng bẫy bùn trước mặt nó, Inky sẽ lập tức rẽ sang lối đi phụ để né tránh bẫy thay vì dẫm vào bùn!
* 🔴 **Shadow (A\* Hunter - Thợ Săn Nón Đỏ Menacing):**
  - Thợ săn nguy hiểm nhất với chu kỳ ra quyết định nhanh gấp đôi hai quái còn lại! Nó luôn "ngửi" thấy vị trí của bạn bằng Heuristic Manhattan và săn lùng theo đường chim bay ngắn nhất.

### 2.4. Thanh Chỉ Số (HUD) & Điều Kiện Thắng/Thua
* **Thanh Sinh Lực (HP):** Mỗi lần va chạm với một quái AI, bạn bị trừ 35 HP. Khi HP về 0, bạn sẽ bị hạ gục (Game Over).
* **Chìa khóa năng lượng:** Đếm số chìa đã nhặt (Yêu cầu $3 / 3$ chìa để mở khóa cổng).
* **Nút "Chơi lại Game":** Tạo mới một mê cung 3D ngẫu nhiên để tiếp tục thử thách.
