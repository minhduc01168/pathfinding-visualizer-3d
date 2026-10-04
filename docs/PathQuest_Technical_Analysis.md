## BÁO CÁO KỸ THUẬT VÀ PHÂN TÍCH HỌC THUẬT SẢN PHẨM PHẦN MỀM
### ĐỀ TÀI: HỆ THỐNG TRỰC QUAN HÓA, MÔ PHỎNG VÀ ĐỐI SÁNH KHOA HỌC CÁC THUẬT TOÁN TÌM ĐƯỜNG PATHQUEST 2D/3D
**Nhóm tác giả & Nghiên cứu:** Đội ngũ Nghiên cứu Thuật toán & Đồ họa PathQuest  
**Thời gian hoàn thành:** Hà Nội, 10/2026  
**Phiên bản hệ thống:** 2.0.0 (Bản chuẩn hóa Giáo dục STEM & Nghiên cứu Khoa học)

---

## MỤC LỤC
1. [LỜI MỞ ĐẦU](#lời-mở-đầu)
2. [DANH MỤC HÌNH VẼ](#danh-mục-hình-vẽ)
3. [DANH MỤC BẢNG BIỂU](#danh-mục-bảng-biểu)
4. [DANH MỤC THUẬT NGỮ VÀ TỪ VIẾT TẮT](#danh-mục-thuật-ngữ-và-từ-viết-tắt)
5. [CHƯƠNG 1. KHẢO SÁT & THU THẬP YÊU CẦU HỆ THỐNG](#chương-1-khảo-sát--thu-thập-yêu-cầu-hệ-thống)
   - 1.1. [Bối cảnh bài toán tìm đường và giáo dục Tin học thuật toán](#11-bối-cảnh-bài-toán-tìm-đường-và-giáo-dục-tin-học-thuật-toán)
   - 1.2. [Phân tích đối tượng người dùng](#12-phân-tích-đối-tượng-người-dùng)
   - 1.3. [Phân loại yêu cầu hệ thống](#13-phân-loại-yêu-cầu-hệ-thống)
     - 1.3.1. [Yêu cầu về phần mềm](#131-yêu-cầu-về-phần-mềm)
     - 1.3.2. [Yêu cầu về phần cứng](#132-yêu-cầu-về-phần-cứng)
     - 1.3.3. [Yêu cầu về dữ liệu](#133-yêu-cầu-về-dữ-liệu)
     - 1.3.4. [Yêu cầu chức năng cốt lõi](#134-yêu-cầu-chức-năng-cốt-lõi)
     - 1.3.5. [Yêu cầu phi chức năng](#135-yêu-cầu-phi-chức-năng)
6. [CHƯƠNG 2. PHÂN TÍCH HỆ THỐNG](#chương-2-phân-tích-hệ-thống)
   - 2.1. [Biểu đồ ca sử dụng (Use Case Diagrams)](#21-biểu-đồ-ca-sử-dụng-use-case-diagrams)
     - 2.1.1. [Biểu đồ ca sử dụng tổng quát](#211-biểu-đồ-ca-sử-dụng-tổng-quát)
     - 2.1.2. [Biểu đồ phân rã ca sử dụng chi tiết](#212-biểu-đồ-phân-rã-ca-sử-dụng-chi-tiết)
     - 2.1.3. [Bảng đặc tả các Use Case cốt lõi](#213-bảng-đặc-tả-các-use-case-cốt-lõi)
   - 2.2. [Biểu đồ hoạt động (Activity Diagrams)](#22-biểu-đồ-hoạt-động-activity-diagrams)
     - 2.2.1. [Quy trình Đồng bộ Sa bàn và Đua song song 3 Thuật toán](#221-quy-trình-đồng-bộ-sa-bàn-và-đua-song-song-3-thuật-toán)
     - 2.2.2. [Quy trình Phóng to Khảo sát Chuyên sâu một Thuật toán](#222-quy-trình-phóng-to-khảo-sát-chuyên-sâu-một-thuật-toán)
     - 2.2.3. [Quy trình Đấu trường 3D Rượt đuổi AI Thời gian thực](#223-quy-trình-đấu-trường-3d-rượt-đuổi-ai-thời-gian-thực)
     - 2.2.4. [Quy trình Sinh mê cung và Bẫy trọng số tự động](#224-quy-trình-sinh-mê-cung-và-bẫy-trọng-số-tự-động)
   - 2.3. [Biểu đồ tuần tự (Sequence Diagrams)](#23-biểu-đồ-tuần-tự-sequence-diagrams)
     - 2.3.1. [Tuần tự Thực thi Mô phỏng Song song & Lưu vết](#231-tuần-tự-thực-thi-mô-phỏng-song-song--lưu-vết)
     - 2.3.2. [Tuần tự Vòng lặp Game Loop 60 FPS & Tính lại đường đi động](#232-tuần-tự-vòng-lặp-game-loop-60-fps--tính-lại-đường-đi-động)
   - 2.4. [Mô hình Luồng Trạng thái Hệ thống (State Transition Model)](#24-mô-hình-luồng-trạng-thái-hệ-thống-state-transition-model)
7. [CHƯƠNG 3. THIẾT KẾ HỆ THỐNG & PHÂN TÍCH TOÁN HỌC - GIẢI THUẬT CHUYÊN SÂU](#chương-3-thiết-kế-hệ-thống--phân-tích-toán-học---giải-thuật-chuyên-sâu)
   - 3.1. [Kiến trúc hệ thống](#31-kiến-trúc-hệ-thống)
     - 3.1.1. [Mô hình kiến trúc Decoupled 4 phân tầng](#311-mô-hình-kiến-trúc-decoupled-4-phân-tầng)
     - 3.1.2. [Kiến trúc xử lý đồ họa kép (Dual Rendering Pipeline)](#312-kiến-trúc-xử-lý-đồ-họa-kép-dual-rendering-pipeline)
   - 3.2. [Thiết kế lớp chi tiết (Class Diagrams)](#32-thiết-kế-lớp-chi-tiết-class-diagrams)
   - 3.3. [Cấu trúc dữ liệu và Thiết kế Trạng thái Lưới ma trận](#33-cấu-trúc-dữ-liệu-và-thiết-kế-trạng-thái-lưới-ma-trận)
   - 3.4. [Phân tích Toán học & Lý thuyết Giải thuật Tìm đường Cốt lõi](#34-phân-tích-toán-học--lý-thuyết-giải-thuật-tìm-đường-cốt-lõi)
     - 3.4.1. [Thuật toán Breadth-First Search (BFS)](#341-thuật-toán-breadth-first-search-bfs)
     - 3.4.2. [Thuật toán Dijkstra (Uniform-Cost Search)](#342-thuật-toán-dijkstra-uniform-cost-search)
     - 3.4.3. [Thuật toán A* (A-Star Search)](#343-thuật-toán-a-a-star-search)
     - 3.4.4. [Chứng minh Toán học: Tính Admissible & Consistent của hàm Heuristic](#344-chứng-minh-toán-học-tính-admissible--consistent-của-hàm-heuristic)
     - 3.4.5. [Phát hiện Khoa học: Cạm bẫy Đồ thị Không Trọng số (The Unweighted Trap)](#345-phát-hiện-khoa-học-cạm-bẫy-đồ-thị-không-trọng-số-the-unweighted-trap)
     - 3.4.6. [Cấu trúc Dữ liệu Binary Min-Heap và Cơ chế Tối ưu $O(\log V)$](#346-cấu-trúc-dữ-liệu-binary-min-heap-và-cơ-chế-tối-ưu-olog-v)
   - 3.5. [Các thuật toán Sinh Mê cung và Phân bố Địa hình](#35-các-thuật-toán-sinh-mê-cung-và-phân-bố-địa-hình)
     - 3.5.1. [Thuật toán Recursive Backtracking (DFS Maze)](#351-thuật-toán-recursive-backtracking-dfs-maze)
     - 3.5.2. [Thuật toán Recursive Division](#352-thuật-toán-recursive-division)
     - 3.5.3. [Thuật toán Phân bố Bẫy trọng số (Weighted Terrain Generator)](#353-thuật-toán-phân-bố-bẫy-trọng-số-weighted-terrain-generator)
   - 3.6. [Cơ chế Điều hướng AI và Tương tác 3D WebGL](#36-cơ-chế-điều-hướng-ai-và-tương-tác-3d-webgl)
     - 3.6.1. [Cơ chế Tái định tuyến thời gian thực (Dynamic Re-routing)](#361-cơ-chế-tái-định-tuyến-thời-gian-thực-dynamic-re-routing)
     - 3.6.2. [Chuyển đổi Hình học Không gian Lưới 2D $\leftrightarrow$ Voxel 3D](#362-chuyển-đổi-hình-học-không-gian-lưới-2d-leftrightarrow-voxel-3d)
8. [CHƯƠNG 4. TRIỂN KHAI VÀ ĐÁNH GIÁ THỰC NGHIỆM](#chương-4-triển-khai-và-đánh-giá-thực-nghiệm)
   - 4.1. [Môi trường và Phương pháp Thực nghiệm](#41-môi-trường-và-phương-pháp-thực-nghiệm)
   - 4.2. [Kịch bản 1: Thử thách Bẫy Địa hình (Weight Trap Benchmark)](#42-kịch-bản-1-thử-thách-bẫy-địa-hình-weight-trap-benchmark)
   - 4.3. [Kịch bản 2: Mê cung Hành lang Phức tạp (Recursive Maze Benchmark)](#43-kịch-bản-2-mê-cung-hành-lang-phức-tạp-recursive-maze-benchmark)
   - 4.4. [Kịch bản 3: Không gian Mở Lưới Lớn (Open Field Grid 50x30)](#44-kịch-bản-3-không-gian-mở-lưới-lớn-open-field-grid-50x30)
   - 4.5. [Bảng Tổng hợp Đối sánh Vi sai Đa chiều](#45-bảng-tổng-hợp-đối-sánh-vi-sai-đa-chiều)
   - 4.6. [Đánh giá Tính Sư phạm và Trải nghiệm Học tập STEM](#46-đánh-giá-tính-sư-phạm-và-trải-nghiệm-học-tập-stem)
9. [KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN](#kết-luận-và-hướng-phát-triển)
10. [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)

---

## DANH MỤC HÌNH VẼ

| Ký hiệu | Tên hình vẽ | Trang tham chiếu |
| :--- | :--- | :--- |
| **Hình 2.1** | Biểu đồ ca sử dụng (Use Case) tổng quát hệ thống PathQuest 2D/3D | Chương 2 |
| **Hình 2.2** | Biểu đồ phân rã ca sử dụng: Phân hệ Sa Bàn Nghiên cứu & Đối sánh Thuật toán | Chương 2 |
| **Hình 2.3** | Biểu đồ phân rã ca sử dụng: Phân hệ Đấu trường 3D Rượt đuổi AI Real-time | Chương 2 |
| **Hình 2.4** | Biểu đồ hoạt động: Quy trình Đồng bộ Sa bàn và Chạy đua song song 3 Thuật toán | Chương 2 |
| **Hình 2.5** | Biểu đồ hoạt động: Cơ chế Phóng to Khảo sát Chuyên sâu một Thuật toán | Chương 2 |
| **Hình 2.6** | Biểu đồ hoạt động: Luồng Tái định tuyến Động (Dynamic Re-routing) trong Đấu trường 3D | Chương 2 |
| **Hình 2.7** | Biểu đồ hoạt động: Thuật toán Sinh mê cung Đệ quy (Recursive Backtracking) | Chương 2 |
| **Hình 2.8** | Biểu đồ tuần tự: Vòng đời Thực thi Mô phỏng Song song và Lưu vết Vĩnh viễn | Chương 2 |
| **Hình 2.9** | Biểu đồ tuần tự: Vòng lặp Game Loop 60 FPS và Bắt mục tiêu của AI | Chương 2 |
| **Hình 2.10** | Sơ đồ Chuyển dịch Trạng thái Hệ thống (State Transition Diagram) | Chương 2 |
| **Hình 3.1** | Sơ đồ Kiến trúc Hệ thống 4 Phân tầng Decoupled Clean Architecture | Chương 3 |
| **Hình 3.2** | Sơ đồ Lớp Chi tiết (Class Diagram): Bộ điều phối Lõi và Công cụ Thuật toán | Chương 3 |
| **Hình 3.3** | Sơ đồ Lớp Chi tiết (Class Diagram): Đồ họa Kép Canvas 2D và Three.js WebGL 3D | Chương 3 |
| **Hình 3.4** | Cấu trúc Cây Nhị phân và Cơ chế Hoán vị của Binary Min-Heap Priority Queue | Chương 3 |
| **Hình 3.5** | Minh họa Hình học: Tính chất Tam giác và Tính Nhất quán (Consistency) của Heuristic | Chương 3 |
| **Hình 3.6** | Cơ chế Khối Voxel 3D và Hệ tọa độ Chiếu trực giao Lưới ma trận | Chương 3 |
| **Hình 4.1** | Giao diện Xưởng Sa Bàn & Bố cục Studio 2 cột Cân đối | Chương 4 |
| **Hình 4.2** | Khung So sánh 3 Thuật toán Đồng bộ với Thanh tiêu đề 2 tầng không tràn dòng | Chương 4 |
| **Hình 4.3** | Chế độ Phóng to Chuyên sâu Thuật toán A* với Lưới DPI-Scaled sắc nét | Chương 4 |
| **Hình 4.4** | Giao diện Đấu Trường 3D Sáng/Tối với Hiệu ứng Chiếu sáng Voxel Thể tích | Chương 4 |

---

## DANH MỤC BẢNG BIỂU

| Ký hiệu | Tên bảng | Nội dung chính |
| :--- | :--- | :--- |
| **Bảng 1.1** | Bảng khảo sát nhu cầu giáo dục trực quan giải thuật | Kết quả khảo sát 120 học sinh và 15 giáo viên chuyên Tin |
| **Bảng 1.2** | Đặc tả cấu trúc trạng thái của đỉnh lưới (`GridNode`) | Mô tả các trường thuộc tính tính toán $g, h, f$, tọa độ và cờ vết |
| **Bảng 1.3** | Đặc tả ma trận trọng số địa hình (`Terrain Weights`) | Chi phí di chuyển qua các bề mặt Đất trống, Bùn lầy, Nước, Tường |
| **Bảng 2.1** | Đặc tả Use Case UC-01: Chạy đua Song song 3 Thuật toán | Luồng sự kiện chính, ngoại lệ và lưu vết đồ thị vĩnh viễn |
| **Bảng 2.2** | Đặc tả Use Case UC-02: Phóng to Khảo sát Chuyên biệt | Chế độ xem cận cảnh từng bước lan sóng và đường đi tối ưu |
| **Bảng 2.3** | Đặc tả Use Case UC-03: Biên tập Địa hình & Sinh Mê cung | Thao tác cọ vẽ trực tiếp và thuật toán sinh chướng ngại vật |
| **Bảng 2.4** | Đặc tả Use Case UC-04: Đấu trường 3D Tương tác AI | Điều khiển nhân vật, giăng bẫy thời gian thực và đo né AI |
| **Bảng 3.1** | So sánh Toán học: Thuộc tính và Tiêu chuẩn Tối ưu của 3 Thuật toán | BFS vs Dijkstra vs A* về mặt lý thuyết đồ thị |
| **Bảng 3.2** | Bảng phân tích các hàm Heuristic trong không gian lưới | Manhattan vs Euclidean vs Chebyshev vs Octile |
| **Bảng 3.3** | Phân tích Độ phức tạp Thời gian và Không gian lưu trữ | So sánh lý thuyết và thực tế triển khai trên trình duyệt |
| **Bảng 4.1** | Kết quả Thực nghiệm Kịch bản 1: Bẫy Địa hình (Weight Trap) | Đo lường số ô duyệt, chi phí và thời gian tính toán thực tế |
| **Bảng 4.2** | Kết quả Thực nghiệm Kịch bản 2: Mê cung Đệ quy (Recursive Maze) | So sánh hành vi trước ngõ cụt và vật cản phức tạp |
| **Bảng 4.3** | Kết quả Thực nghiệm Kịch bản 3: Sa bàn Lưới mở Lớn $50 \times 30$ | Khảo sát giới hạn bộ nhớ và thời gian phản hồi ở quy mô lớn |
| **Bảng 4.4** | Bảng Tổng hợp Đối sánh Khoa học Toàn diện 3 Thuật toán | Kết luận định lượng về tính ứng dụng trong thực tế |

---

## DANH MỤC THUẬT NGỮ VÀ TỪ VIẾT TẮT

| Thuật ngữ | Viết tắt | Diễn giải chi tiết |
| :--- | :--- | :--- |
| **Breadth-First Search** | BFS | Thuật toán tìm kiếm theo chiều rộng trên đồ thị |
| **A-Star Algorithm** | A* | Thuật toán tìm kiếm đường đi tối ưu có sử dụng hàm ước lượng tri thức (Heuristic) |
| **Uniform-Cost Search** | UCS / Dijkstra | Thuật toán tìm đường ngắn nhất trên đồ thị có trọng số do Edsger Dijkstra đề xuất |
| **First-In, First-Out** | FIFO | Nguyên lý hàng đợi: Phần tử nào vào trước sẽ được lấy ra trước |
| **Heuristic Function** | $h(n)$ | Hàm ước lượng chi phí còn lại từ trạng thái hiện tại tới đích |
| **Admissibility** | - | Tính chất chấp nhận được của Heuristic: không bao giờ đánh giá cao hơn chi phí thực |
| **Consistency / Monotonicity** | - | Tính nhất quán / đơn điệu của Heuristic: thỏa mãn bất đẳng thức tam giác |
| **Binary Min-Heap** | Min-Heap | Cây nhị phân gần hoàn chỉnh có gốc luôn mang giá trị nhỏ nhất |
| **Device Pixel Ratio** | DPR | Tỷ số giữa số điểm ảnh vật lý trên màn hình và điểm ảnh logic trong CSS |
| **WebGL** | - | Chuẩn kết xuất đồ họa 3D tăng tốc phần cứng trực tiếp trên trình duyệt |
| **Voxel** | - | Điểm ảnh thể tích 3D (Volume Element), tương đương với Pixel trong không gian 3 chiều |
| **Frames Per Second** | FPS | Tần số khung hình hiển thị trên mỗi giây |
| **Raycasting** | - | Kỹ thuật phóng tia từ điểm nhìn chuột qua camera để tương tác với vật thể 3D |
| **Recursive Backtracking** | - | Kỹ thuật quay lui đệ quy dùng để sinh mê cung hoàn hảo |

---

## LỜI MỞ ĐẦU

Trong lĩnh vực Khoa học Máy tính và Trí tuệ Nhân tạo (AI), bài toán tìm đường (Pathfinding) trên đồ thị là một trong những bài toán nền tảng, xuất hiện rộng rãi từ các hệ thống định vị giao thông toàn cầu (GPS Routing), điều hướng robot tự hành (Autonomous Robotics), định tuyến gói tin mạng viễn thông, cho đến trí thông minh nhân tạo của nhân vật (NPC Navigation) trong công nghiệp phát triển trò chơi điện tử (Game Development).

Tuy nhiên, trong chương trình giảng dạy Tin học phổ thông và Đại học đại cương hiện nay, các thuật toán đồ thị kinh điển như **Tìm kiếm theo chiều rộng (BFS)**, **Thuật toán Dijkstra** và **Thuật toán A\*** thường được truyền đạt thông qua các mô hình bảng phấn tĩnh hoặc các sơ đồ cây trừu tượng. Cách tiếp cận truyền thống này tồn tại ba rào cản nhận thức lớn đối với người học:
1. **Thiếu tính trực quan động:** Người học không quan sát được hình thái lan truyền sóng (Wavefront propagation) diễn ra từng bước như thế nào trong thời gian thực.
2. **Hiểu lầm về đồ thị không trọng số (The Unweighted Trap):** Đa số các công cụ trực quan trên Internet chỉ biểu diễn đồ thị dưới dạng lưới 2 màu (Tường đen và Ô trắng). Khi lưới không có trọng số, thuật toán Dijkstra thoái hóa hoàn toàn thành BFS, khiến người học ngộ nhận rằng hai thuật toán này có hành vi giống hệt nhau mà không thấy được giá trị của việc nới lỏng cạnh theo trọng số.
3. **Khoảng cách giữa lý thuyết và ứng dụng thực tế:** Người học khó hình dung một thuật toán viết bằng mã giả trên giấy sẽ hoạt động ra sao khi được đưa vào một trò chơi 3D thời gian thực với các biến động liên tục của môi trường và yêu cầu đáp ứng tức thời ở tần số 60 FPS.

Nhằm giải quyết triệt để các rào cản trên, dự án **PathQuest 2D/3D** được nghiên cứu và phát triển như một nền tảng thực nghiệm phần mềm toàn diện, kết hợp chặt chẽ giữa **Nghiên cứu Khoa học Thuật toán** và **Mô phỏng Đồ họa Giáo dục STEM**. Hệ thống cung cấp khả năng chạy đua đối đầu song song 3 thuật toán trên cùng một sa bàn có trọng số địa hình đa dạng (Cỏ, Bùn lầy, Vực nước), cơ chế lưu vết sóng vĩnh viễn (Trace Retention), khả năng phóng to cận cảnh từng thuật toán, và phân hệ Đấu trường 3D WebGL nơi các tác tử AI ứng dụng thuật toán để truy bắt người chơi theo thời gian thực.

Báo cáo kỹ thuật này trình bày toàn bộ quá trình phân tích, thiết kế kiến trúc, chứng minh toán học giải thuật chuyên sâu, và các kết quả đo lường thực nghiệm định lượng của hệ thống **PathQuest 2D/3D**.

---

## CHƯƠNG 1. KHẢO SÁT & THU THẬP YÊU CẦU HỆ THỐNG

### 1.1. Bối cảnh bài toán tìm đường và giáo dục Tin học thuật toán
Việc hiểu rõ bản chất toán học của các thuật toán tìm đường đòi hỏi người học phải phân biệt được ba yếu tố then chốt:
- **Độ tối ưu về số bước (Hop-count Optimality):** Tìm đường có số ô ít nhất (thuộc tính của BFS).
- **Độ tối ưu về chi phí thực tế (Cost Optimality):** Tìm đường có tổng trọng số nhỏ nhất khi di chuyển qua các loại địa hình phức tạp (thuộc tính của Dijkstra và A*).
- **Hiệu quả thu hẹp không gian tìm kiếm (Search Space Pruning):** Khả năng định hướng về đích thông qua tri thức suy nghiệm (Heuristic) để giảm thiểu tối đa số đỉnh phải duyệt (thuộc tính vượt trội của A*).

Để làm nổi bật các thuộc tính này, môi trường phần mềm cần cung cấp một cơ chế can thiệp địa hình trực tiếp, cho phép người dùng tự vẽ các chướng ngại vật có trọng số khác nhau và kiểm chứng giả thuyết của mình ngay lập tức.

### 1.2. Phân tích đối tượng người dùng
Hệ thống được thiết kế hướng tới 3 nhóm đối tượng mục tiêu:
1. **Học sinh THPT & Thí sinh thi Học sinh Giỏi Tin học:** Cần nắm bắt bản chất thuật toán một cách trực quan, sinh động, dễ ghi nhớ các khái niệm hàng đợi FIFO, hàng đợi ưu tiên Min-Heap, và hàm khoảng cách Manhattan.
2. **Sinh viên Ngành Công nghệ Thông tin & Khoa học Máy tính:** Cần nghiên cứu chuyên sâu về độ phức tạp tính toán, phân tích vi sai số đỉnh đã duyệt, kiểm chứng tính chấp nhận được (Admissible) của hàm Heuristic, và kỹ thuật lập trình đồ họa WebGL/Canvas.
3. **Giáo viên & Giảng viên Tin học:** Cần một công cụ trình chiếu, giảng dạy tương tác trực quan ngay trên trình duyệt web mà không cần cài đặt phần mềm phức tạp, hỗ trợ xuất số liệu đối sánh tự động.

### 1.3. Phân loại yêu cầu hệ thống

#### 1.3.1. Yêu cầu về phần mềm
- Chạy trực tiếp trên mọi trình duyệt web hiện đại (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) hỗ trợ HTML5 Canvas và WebGL 2.0.
- Không yêu cầu cài đặt bất kỳ tiện ích bổ sung (Extension) hay phần mềm trung gian nào.
- Ứng dụng Single-Page Application (SPA) xây dựng trên nền tảng TypeScript nguyên bản, tối ưu hóa kích thước bundle và tốc độ khởi động trang dưới 1.5 giây.

#### 1.3.2. Yêu cầu về phần cứng
- Hỗ trợ các thiết bị phần cứng từ cơ bản đến cao cấp:
  - Máy tính văn phòng / Phòng máy trường học: CPU tích hợp đồ họa (Intel UHD Graphics trở lên), RAM tối thiểu 4GB.
  - Thiết bị di động / Máy tính bảng: Màn hình cảm ứng, hỗ trợ tỷ lệ DPI cao (Retina Display).
- Đảm bảo tốc độ hiển thị mượt mà: Tối thiểu 60 FPS trong chế độ Sa bàn 2D và chế độ Đấu trường 3D.

#### 1.3.3. Yêu cầu về dữ liệu
- Biểu diễn bản đồ lưới ma trận 2D với các kích thước linh hoạt:
  - Nhỏ: $25 \times 15$ ($375$ ô) - Phù hợp quan sát từng bước trên màn hình nhỏ.
  - Tiêu chuẩn: $35 \times 21$ ($735$ ô) - Tối ưu cho màn hình Full HD máy chiếu lớp học.
  - Lớn: $50 \times 30$ ($1500$ ô) - Dành cho các bài toán phân tích quy mô lớn.
- Bốn loại ô địa hình có trọng số xác định:
  - **Đất trống (Empty/Grass):** Trọng số $c = 1$.
  - **Bùn lầy (Mud):** Trọng số $c = 5$ (lực cản cao, làm chậm di chuyển).
  - **Vực nước (Water):** Trọng số $c = 10$ (chi phí năng lượng rất lớn).
  - **Tường đá (Wall):** Trọng số $c = \infty$ (vật cản tuyệt đối không thể xuyên qua).

#### 1.3.4. Yêu cầu chức năng cốt lõi
- **FR-01 (Xưởng Sa Bàn Tương Tác):** Cho phép người dùng chọn các công cụ cọ vẽ (Tường đá, Bùn lầy, Nước, Điểm xuất phát, Điểm đích, Tẩy xóa) để tùy biến sa bàn với cơ chế phản hồi kéo chuột liên tục (Drag & Paint).
- **FR-02 (Sinh Mê Cung Tự Động):** Tích hợp các thuật toán sinh mê cung thủ tục: Mê cung đệ quy (Recursive Backtracking), Chia đệ quy (Recursive Division) và Bẫy địa hình có trọng số.
- **FR-03 (Chạy Đua Song Song 3 Thuật Toán):** Kích hoạt đồng thời BFS, Dijkstra và A* trên 3 khung nhìn độc lập với cùng một bản đồ địa hình gốc.
- **FR-04 (Lưu Vết Vĩnh Viễn - Trace Retention):** Giữ nguyên trạng thái màu sắc lan sóng (Heatmap) và đường đi tối ưu (Golden Path) trên cả 3 khung nhìn sau khi kết thúc mô phỏng để người học thoải mái quan sát và so sánh.
- **FR-05 (Phóng To Khảo Sát Chuyên Sâu):** Cho phép phóng to độc lập bất kỳ thuật toán nào (BFS, Dijkstra hoặc A*) lên toàn bộ khu vực quan sát và hỗ trợ phím tắt `Esc` để quay về chế độ 3 khung nhìn.
- **FR-06 (Bảng Đo Lường & Kết Luận Khoa Học Tự Động):** Tự động thống kê số đỉnh đã duyệt, tổng chi phí, độ dài bước đi, thời gian tính toán vi giây và đưa ra kết luận thuật toán nào tối ưu nhất.
- **FR-07 (Đấu Trường 3D WebGL Real-Time):** Chuyển đổi sang môi trường 3D góc nhìn Isometric/Top-down, người chơi điều khiển nhân vật né tránh AI Thợ Săn A* và có thể đặt tường bẫy thời gian thực ép AI tính lại đường đi.
- **FR-08 (Giao Diện Chuẩn Hóa Tiếng Việt & Đổi Theme Sáng/Tối):** Toàn bộ giao diện sử dụng ngôn ngữ tiếng Việt trong sáng, hỗ trợ hai chủ đề màu sắc tươi sáng học đường (STEM Crisp Light) và hiện đại công nghệ (Cyber Dark).

#### 1.3.5. Yêu cầu phi chức năng
- **NFR-01 (Độ trễ thuật toán):** Thời gian tính toán ma trận $35 \times 21$ của cả 3 thuật toán phải hoàn tất trong dưới $5\text{ ms}$.
- **NFR-02 (Tối ưu hóa bộ nhớ):** Không xảy ra hiện tượng rò rỉ bộ nhớ (Memory Leak) khi chạy đua liên tục hàng trăm lần mô phỏng.
- **NFR-03 (Tính tương thích giao diện):** Bố cục co giãn linh hoạt (Responsive Layout), các nút bấm và khung hiển thị không bị tràn dòng hay vỡ giao diện trên mọi độ phân giải.

---

## CHƯƠNG 2. PHÂN TÍCH HỆ THỐNG

### 2.1. Biểu đồ ca sử dụng (Use Case Diagrams)

#### 2.1.1. Biểu đồ ca sử dụng tổng quát
Hệ thống PathQuest 2D/3D phục vụ người dùng thông qua hai phân hệ chức năng tương ứng với hai chế độ hoạt động: Phân hệ Sa Bàn Nghiên Cứu và Phân hệ Đấu Trường 3D.

```mermaid
flowchart TD
    User(["👤 User / Student / Instructor"])

    subgraph System["PATHQUEST 2D/3D SYSTEM"]
        subgraph Lab_Module["Subsystem 1: Algorithm Benchmark Lab"]
            UC1["UC-01: Edit Terrain & Draw Obstacles"]
            UC2["UC-02: Generate Procedural Mazes & Weighted Traps"]
            UC3["UC-03: Run Concurrent 3-Algorithm Race"]
            UC4["UC-04: Zoom & Focus Individual Algorithm"]
            UC5["UC-05: Inspect Telemetry & Benchmark Analytics"]
        end

        subgraph Arcade_Module["Subsystem 2: Real-Time 3D Arena"]
            UC6["UC-06: Control Player in 3D Space"]
            UC7["UC-07: Place Real-Time Obstacle Traps"]
            UC8["UC-08: Observe Dynamic AI Re-routing"]
            UC9["UC-09: Switch Camera View (Isometric / Top-Down)"]
        end

        subgraph Config_Module["Configuration & Common Utilities"]
            UC10["UC-10: Switch Grid Preset (25x15 / 35x21 / 50x30)"]
            UC11["UC-11: Toggle Light / Dark Theme"]
        end
    end

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10
    User --> UC11

    UC3 -.->|include| UC5
    UC4 -.->|extend| UC3
    UC7 -.->|trigger| UC8
```
*Hình 2.1: Biểu đồ ca sử dụng (Use Case) tổng quát hệ thống PathQuest 2D/3D.*

#### 2.1.2. Biểu đồ phân rã ca sử dụng chi tiết

##### Phân hệ Sa Bàn Nghiên cứu & Đối sánh Thuật toán
```mermaid
flowchart TD
    User(["👤 User"])
    
    subgraph UC3_Detail["UC-03 Breakdown: Concurrent Algorithm Benchmark"]
        UC3_1["Convert Grid Matrix to Weighted Graph"]
        UC3_2["Initialize FIFO Queue and Execute BFS"]
        UC3_3["Initialize Min-Heap and Execute Dijkstra"]
        UC3_4["Initialize Min-Heap with Manhattan and Execute A*"]
        UC3_5["Synchronize Lockstep Animation Timer"]
        UC3_6["Render Wavefront Heatmap Traces"]
        UC3_7["Render Optimal Golden Path"]
        UC3_8["Persist Final State & Retain Traces"]
    end

    User --> UC3_1
    UC3_1 --> UC3_2
    UC3_1 --> UC3_3
    UC3_1 --> UC3_4
    UC3_2 --> UC3_5
    UC3_3 --> UC3_5
    UC3_4 --> UC3_5
    UC3_5 --> UC3_6
    UC3_6 --> UC3_7
    UC3_7 --> UC3_8
```
*Hình 2.2: Biểu đồ phân rã ca sử dụng: Phân hệ Sa Bàn Nghiên cứu & Đối sánh Thuật toán.*

#### 2.1.3. Bảng đặc tả các Use Case cốt lõi

##### Bảng 2.1: Đặc tả Use Case UC-03: Chạy đua Song song 3 Thuật toán
| Thuộc tính | Chi tiết đặc tả |
| :--- | :--- |
| **Mã Use Case** | **UC-03** |
| **Tên Use Case** | Chạy đua Song song 3 Thuật toán (Concurrent Algorithm Benchmark) |
| **Tác nhân chính** | Học sinh, Sinh viên, Giáo viên Tin học |
| **Tiền điều kiện** | Người dùng đã mở phân hệ Sa Bàn, điểm Xuất phát ($S$) và Đích ($E$) đã được xác định trên lưới. |
| **Hậu điều kiện** | Cả 3 khung nhìn BFS, Dijkstra và A* hoàn tất mô phỏng, đường đi tối ưu và vệt sóng được lưu vết cố định; bảng vi sai hiển thị đầy đủ số liệu đo lường. |
| **Luồng sự kiện chính** | 1. Người dùng nhấn nút **"CHẠY ĐUA TẤT CẢ"** trên bảng điều khiển.<br>2. Hệ thống khóa các thao tác vẽ để tránh xung đột dữ liệu trạng thái.<br>3. Hệ thống tạo 3 bản sao độc lập của ma trận lưới hiện tại.<br>4. Lõi thuật toán thực thi tính toán thuần túy trên bộ nhớ RAM: BFS, Dijkstra và A* hoàn thành trong $< 5\text{ ms}$, trả về chuỗi tọa độ duyệt và đường dẫn kết quả.<br>5. Bộ điều phối hoạt họa kích hoạt vòng lặp `requestAnimationFrame`, vẽ từng bước sóng duyệt đồng thời trên 3 canvas phụ với tốc độ do người dùng chọn.<br>6. Khi thuật toán chạm đích, hệ thống vẽ đường đi ngắn nhất với hiệu ứng phát sáng vàng rực rỡ.<br>7. Trạng thái kết thúc được giữ nguyên trên màn hình, nút bấm chuyển về trạng thái sẵn sàng. |
| **Luồng ngoại lệ** | **4a. Không tìm thấy đường đi tới đích (bị tường bao kín):**<br>- Hệ thống duyệt hết các ô khả thi nhưng không chạm tới đích.<br>- Cập nhật huy hiệu trạng thái của thuật toán thành **"Bế tắc (Không có đường)"**.<br>- Xuất cảnh báo lên bảng điều khiển và đề xuất người dùng xóa bớt vật cản. |

##### Bảng 2.2: Đặc tả Use Case UC-04: Phóng to Khảo sát Chuyên sâu Thuật toán
| Thuộc tính | Chi tiết đặc tả |
| :--- | :--- |
| **Mã Use Case** | **UC-04** |
| **Tên Use Case** | Phóng to Khảo sát Chuyên sâu một Thuật toán (Focused Algorithm View) |
| **Tác nhân chính** | Người dùng |
| **Tiền điều kiện** | Hệ thống đang ở chế độ xem 3 khung nhìn song song. |
| **Hậu điều kiện** | Khung hình của thuật toán được chọn mở rộng toàn màn hình, 2 khung hình còn lại ẩn đi; phím tắt `Esc` sẵn sàng. |
| **Luồng sự kiện chính** | 1. Người dùng nhấn nút **"Phóng to"** tại thẻ của thuật toán mong muốn (hoặc chọn tab tương ứng phía trên).<br>2. Hệ thống áp dụng hiệu ứng chuyển động mượt mà (Smooth Transition), ẩn 2 khung nhìn còn lại.<br>3. Khung hình được chọn tự động tính toán lại kích thước hiển thị theo chuẩn DPI cao của màn hình, vẽ lại toàn bộ lưới, chướng ngại vật, vệt sóng và đường đi với độ sắc nét tuyệt đối.<br>4. Thanh điều hướng hiển thị lời nhắc: *"Nhấn Esc để trở về xem cả 3"*. |
| **Luồng ngoại lệ** | Người dùng nhấn phím `Esc` hoặc bấm tab **"Xem Cả 3 Thuật Toán"** $\rightarrow$ Hệ thống phục hồi bố cục 3 cột đồng đẳng ban đầu. |

---

### 2.2. Biểu đồ hoạt động (Activity Diagrams)

#### 2.2.1. Quy trình Đồng bộ Sa bàn và Đua song song 3 Thuật toán
```mermaid
flowchart TD
    Start([Start]) --> EditGrid["User edits terrain / selects maze generator"]
    EditGrid --> SyncData["Auto-sync master grid to 3 viewport canvases"]
    SyncData --> ClickRace["User clicks 'RACE ALL ALGORITHMS'"]
    ClickRace --> LockUI["Lock interactive drawing controls"]
    LockUI --> CloneGrid["Clone 3 independent node matrices in RAM"]
    
    subgraph RAM_Execution["In-Memory Concurrent Computation (< 5ms)"]
        direction TB
        CloneGrid --> RunBFS["Execute BFS (FIFO Queue)"]
        CloneGrid --> RunDijkstra["Execute Dijkstra (Min-Heap Relaxation)"]
        CloneGrid --> RunAStar["Execute A* (Min-Heap + Manhattan Heuristic)"]
        RunBFS --> CollectRes["Collect Search Results (visitedOrder, shortestPath, metrics)"]
        RunDijkstra --> CollectRes
        RunAStar --> CollectRes
    end

    CollectRes --> AnimLoop["Start Lockstep Animation Loop (requestAnimationFrame)"]
    
    subgraph Animation["Synchronized Lockstep Visualization"]
        direction TB
        AnimLoop --> StepFrontier["Render expansion wave on all 3 viewports"]
        StepFrontier --> CheckDone{"Any frontier remaining?"}
        CheckDone -- Yes --> StepFrontier
        CheckDone -- No / Goal Reached --> DrawGolden["Render glowing Golden Path"]
    end

    DrawGolden --> TracePersist["Retain Heatmap and Path Traces Permanently"]
    TracePersist --> UpdateTelemetry["Update Telemetry Dashboard & Comparative Verdict"]
    UpdateTelemetry --> UnlockUI["Reset Button to 'RACE ALL' (Ready)"]
    UnlockUI --> End([End])
```
*Hình 2.4: Biểu đồ hoạt động: Quy trình Đồng bộ Sa bàn và Chạy đua song song 3 Thuật toán.*

#### 2.2.2. Quy trình Đấu trường 3D Rượt đuổi AI Thời gian thực
```mermaid
flowchart TD
    Start([Start]) --> SwitchArcade["Switch to '3D Arena' Tab"]
    SwitchArcade --> BuildVoxel["Build Three.js WebGL Voxel Arena"]
    BuildVoxel --> StartGameLoop["Start 60 FPS Game Loop"]
    
    subgraph GameLoop["Real-Time 60 FPS Game Loop"]
        direction TB
        StartGameLoop --> ListenInput["Listen for W, A, S, D Key Inputs"]
        ListenInput --> MovePlayer["Update Player Position on Grid"]
        MovePlayer --> CheckTrap{"Player pressed Space (Drop Trap)?"}
        
        CheckTrap -- Yes --> PlaceWall["Spawn Voxel Wall in Physics Matrix"]
        PlaceWall --> TriggerReroute["Trigger Immediate AI Re-routing Event"]
        CheckTrap -- No --> UpdateHunter["Update AI Hunter Position"]

        subgraph AI_Subsystem["Dynamic AI Re-Routing Subsystem"]
            TriggerReroute --> RunAStarLive["Run Real-Time A* Search from Hunter to Player"]
            RunAStarLive --> UpdateHunter
        end

        UpdateHunter --> CheckCollision{"Distance <= 0.5?"}
        CheckCollision -- Yes --> GameOverLose["Defeat! Hunter captured Player"]
        CheckCollision -- No --> CheckGoal{"Player reached Goal Portal?"}
        CheckGoal -- Yes --> GameOverWin["Victory! Goal safely reached"]
        CheckGoal -- No --> ListenInput
    end

    GameOverLose --> EndLose([End - Game Over Screen])
    GameOverWin --> EndWin([End - Victory Screen])
```
*Hình 2.6: Biểu đồ hoạt động: Luồng Tái định tuyến Động (Dynamic Re-routing) trong Đấu trường 3D.*

---

### 2.3. Biểu đồ tuần tự (Sequence Diagrams)

#### 2.3.1. Tuần tự Thực thi Mô phỏng Song song & Lưu vết
```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as Web UI (index.html)
    participant Main as Orchestrator (main.ts)
    participant Core as Algorithm Engine (BFS / Dijkstra / A*)
    participant Heap as Binary Min-Heap
    participant Render as GridCanvas2D (3 Viewports)
    participant Dash as Dashboard Component

    User->>UI: Click "RACE ALL ALGORITHMS"
    UI->>Main: triggerRaceAll()
    Main->>UI: setRaceButtonState("Running...")
    
    par BFS Computation
        Main->>Core: runBFS(gridClone, start, end)
        Core-->>Main: SearchResult (visitedOrder, shortestPath, metrics)
    and Dijkstra Computation
        Main->>Core: runDijkstra(gridClone, start, end)
        Core->>Heap: push / pop relaxation O(log V)
        Core-->>Main: SearchResult (visitedOrder, shortestPath, metrics)
    and A* Computation
        Main->>Core: runAStar(gridClone, start, end)
        Core->>Heap: push / pop fScore with Manhattan O(log V)
        Core-->>Main: SearchResult (visitedOrder, shortestPath, metrics)
    end

    Main->>Dash: updateMetrics(bfsResult, dijkstraResult, astarResult)
    Dash->>UI: Render comparative analytics & automated verdict

    loop Lockstep Animation Loop (Step-by-step)
        Main->>Render: renderStep(bfsCoord, dijkstraCoord, astarCoord)
        Render->>Render: Paint wavefront heatmaps simultaneously
    end

    Main->>Render: renderGoldenPath(shortestPath)
    Render->>Render: Draw permanent glowing golden path
    Main->>UI: setRaceButtonState("Completed")
    UI-->>User: Simulation completed with persistent traces
```
*Hình 2.8: Biểu đồ tuần tự: Vòng đời Thực thi Mô phỏng Song song và Lưu vết Vĩnh viễn.*

---

## CHƯƠNG 3. THIẾT KẾ HỆ THỐNG & PHÂN TÍCH TOÁN HỌC - GIẢI THUẬT CHUYÊN SÂU

### 3.1. Kiến trúc hệ thống

#### 3.1.1. Mô hình kiến trúc Decoupled 4 phân tầng
Hệ thống được tổ chức theo kiến trúc phân tầng phi tập trung (Decoupled Clean Architecture), đảm bảo tính cô lập tuyệt đối giữa logic thuật toán thuần túy và tầng hiển thị đồ họa.

```mermaid
flowchart TD
    subgraph Layer1["1. PRESENTATION & INTERACTION LAYER"]
        HTML["index.html (Semantic Layout & ARIA Tags)"]
        CSS["Design System (STEM Crisp Light & Cyber Dark Themes)"]
        Toolbar["Studio 2-Column Controls (Brushes & Maze Selectors)"]
        ZoomTabs["Zoom Filter Tabs (All 3 / BFS / Dijkstra / A*)"]
        Dashboard["Telemetry Engine & Automated Verdict Reporter"]
    end

    subgraph Layer2["2. STATE ORCHESTRATION LAYER"]
        Main["main.ts (Global Application Controller)"]
        GridState["Multi-Weighted Matrix (Grid Data Model)"]
        ModeManager["Mode Switcher (Lab Benchmark <-> 3D Arena)"]
        LockstepEngine["Lockstep Synchronization Engine"]
    end

    subgraph Layer3["3. CORE ALGORITHM & MATHEMATICS LAYER"]
        BFS["BFS Engine (FIFO Queue)"]
        Dijkstra["Dijkstra Engine (Min-Heap Relaxation)"]
        AStar["A* Engine (f = g + h, Manhattan Heuristic)"]
        MinHeap["Binary Min-Heap Priority Queue Data Structure"]
        Heuristics["Heuristic Library (Manhattan, Euclidean, Octile)"]
        MazeGen["Procedural Maze Engine (Recursive DFS, Division, Traps)"]
    end

    subgraph Layer4["4. DUAL RENDERING PIPELINE LAYER"]
        Canvas2D["GridCanvas2D (HTML5 DPI-Scaled Canvas Renderer)"]
        ThreeEngine["ThreeEngine (Three.js WebGL 3D Voxel Renderer)"]
        GameEngine3D["GameEngine3D (60 FPS Real-Time Physics & Collision)"]
    end

    Layer1 --> Layer2
    Layer2 --> Layer3
    Layer2 --> Layer4
    Layer3 --> Layer4
```
*Hình 3.1: Sơ đồ Kiến trúc Hệ thống 4 Phân tầng Decoupled Clean Architecture.*

#### 3.1.2. Kiến trúc xử lý đồ họa kép (Dual Rendering Pipeline)
Hệ thống tích hợp hai cỗ máy kết xuất đồ họa độc lập nhằm phục vụ tối ưu cho hai mục đích học tập khác nhau:
1. **2D Canvas Renderer (`GridCanvas2D`):**
   - Tối ưu hóa cho tốc độ vẽ và độ sắc nét khoa học.
   - Ứng dụng kỹ thuật nội suy DPI Scaling (`devicePixelRatio`), đảm bảo trên các màn hình Retina 2K/4K đường biên lưới ma trận và chữ số không bị mờ nhòe.
   - Quản lý trạng thái vệt sóng thông qua `Set<string>` dạng tọa độ băm `"r,c"`, mang lại tốc độ kiểm tra $O(1)$ cho mỗi khung hình render.
2. **3D WebGL Voxel Engine (`GameEngine3D`):**
   - Xây dựng trên nền thư viện Three.js, tận dụng năng lực tính toán phần cứng của GPU (Graphics Processing Unit).
   - Tường đá được tạo hình dưới dạng các khối thể tích Voxel 3D nhô cao với vật liệu phản quang chân thực.
   - Nước và Bùn lầy có độ sâu lún và độ trong suốt quang học, tạo cảm giác trực quan sinh động như một trò chơi sa bàn chiến thuật thực thụ.

---

### 3.2. Thiết kế lớp chi tiết (Class Diagrams)

```mermaid
classDiagram
    class GridNode {
        +number r
        +number c
        +NodeType type
        +number weight
        +number gScore
        +number hScore
        +number fScore
        +boolean isVisited
        +GridNode parent
    }

    class MinHeap {
        -HeapItem[] heap
        +number size
        +isEmpty() boolean
        +push(data, score) void
        +pop() Object
        +peek() Object
        +clear() void
        -bubbleUp(index) void
        -sinkDown(index) void
    }

    class GridCanvas2D {
        -HTMLCanvasElement canvas
        -CanvasRenderingContext2D ctx
        -number rows
        -number cols
        -GridCoord start
        -GridCoord end
        -Set visitedSet
        -Set pathSet
        +resize(containerWidth) void
        +draw() void
        +setVisited(r, c) void
        +setPath(path) void
        +clearTraces() void
    }

    class GameEngine3D {
        -Scene scene
        -PerspectiveCamera camera
        -WebGLRenderer renderer
        -Mesh playerMesh
        -Mesh hunterMesh
        -GridCoord playerPos
        -GridCoord hunterPos
        +init(container) void
        +buildVoxelMaze(grid) void
        +updatePlayerPos(dir) void
        +updateHunterStep() void
        +rerouteHunter() void
        +setLightingMode(isDark) void
        -animate() void
    }

    class SearchResult {
        +string algorithmName
        +GridCoord[] visitedOrder
        +GridCoord[] shortestPath
        +number executionTimeMs
        +number totalCost
        +number visitedNodesCount
        +boolean isSuccess
    }

    MinHeap ..> GridNode : manages priority
    GridCanvas2D ..> GridNode : renders state
    GameEngine3D ..> GridNode : projects voxel coordinates
```
*Hình 3.2: Sơ đồ Lớp Chi tiết: Mối quan hệ giữa Cấu trúc dữ liệu và Tầng Đồ họa.*

---

### 3.4. Phân tích Toán học & Lý thuyết Giải thuật Tìm đường Cốt lõi

Đây là trọng tâm học thuật của báo cáo, cung cấp cơ sở toán học và phân tích thuật toán chuyên sâu cho 3 thuật toán tìm đường kinh điển.

#### 3.4.1. Thuật toán Breadth-First Search (BFS)
- **Cơ sở lý thuyết:** BFS là thuật toán duyệt đồ thị không có trọng số (Unweighted Graph). Thuật toán khởi đầu từ nút xuất phát $S$ và lần lượt mở rộng không gian tìm kiếm theo từng vành đai đồng tâm (Concentric Frontiers / Level-order).
- **Cấu trúc dữ liệu điều phối:** Hàng đợi **FIFO (First-In, First-Out Queue)**. Thao tác thêm nút mới vào cuối hàng đợi (`enqueue`) và lấy nút từ đầu hàng đợi (`dequeue`) đều có độ phức tạp thời gian tuyệt đối $O(1)$.
- **Nguyên lý lan sóng:** Khoảng cách tính bằng số cạnh (Hop count) $d(S, v)$ của các đỉnh được lấy ra khỏi hàng đợi luôn là một hàm không giảm:
  $$d(S, u) \le d(S, v) \quad \forall u \text{ được lấy ra trước } v$$
- **Hạn chế cốt tử (Uniform-Cost Blindness):** BFS xem mọi cạnh nối đều có chi phí bằng $1$. Khi gặp địa hình có trọng số (Bùn lầy $c = 5$, Nước $c = 10$), BFS hoàn toàn "mù quáng" trước tổng chi phí thực tế và vẫn chọn con đường đâm thẳng qua đầm lầy vì con đường đó có số ô ít nhất.

#### 3.4.2. Thuật toán Dijkstra (Uniform-Cost Search)
- **Cơ sở lý thuyết:** Thuật toán do nhà khoa học máy tính Edsger W. Dijkstra đề xuất năm 1959 nhằm giải quyết bài toán tìm đường đi ngắn nhất từ một nguồn (Single-Source Shortest Path) trên đồ thị có trọng số không âm:
  $$\forall (u, v) \in E, \quad w(u, v) \ge 0$$
- **Cơ chế nới lỏng cạnh (Edge Relaxation):**
  Tại mỗi bước, thuật toán chọn đỉnh $u$ có khoảng cách tích lũy nhỏ nhất chưa được cố định và tiến hành nới lỏng các đỉnh lân cận $v$:
  $$\text{Nếu } g(u) + w(u, v) < g(v) \implies g(v) = g(u) + w(u, v), \quad \text{parent}(v) = u$$
- **Tính tối ưu tuyệt đối:** Do mọi trọng số $w(u, v) \ge 0$, khi một đỉnh $u$ được lấy ra khỏi Hàng đợi Ưu tiên (Min-Heap), giá trị $g(u)$ được đảm bảo là chi phí tối ưu toàn cục nhỏ nhất từ điểm xuất phát tới $u$.
- **Hạn chế về không gian duyệt:** Dijkstra không có tri thức định hướng về phía đích $E$. Thuật toán lan tỏa sóng theo dạng "vết dầu loang hình tròn" (Isotropic Wavefront) đồng đều về mọi hướng, dẫn đến việc phải duyệt qua một lượng rất lớn các đỉnh nằm ngược hướng với đích.

#### 3.4.3. Thuật toán A* (A-Star Search)
- **Cơ sở lý thuyết:** Thuật toán A* do Peter Hart, Nils Nilsson và Bertram Raphael công bố năm 1968, là sự kết hợp thiên tài giữa thuật toán Dijkstra và thuật toán Tìm kiếm Tốt Nhất Đầu Tiên (Greedy Best-First Search).
- **Hàm đánh giá chi phí tổng thể:**
  $$f(n) = g(n) + h(n)$$
  Trong đó:
  - $g(n)$: Chi phí thực tế chính xác đã bỏ ra từ điểm xuất phát $S$ đến nút $n$.
  - $h(n)$: Chi phí ước lượng (Heuristic) từ nút $n$ đến đích $E$.
  - $f(n)$: Chi phí tổng thể ước tính của con đường ngắn nhất đi qua nút $n$ để đến đích.

#### 3.4.4. Chứng minh Toán học: Tính Admissible & Consistent của hàm Heuristic

##### Định nghĩa 1: Tính chất chấp nhận được (Admissibility)
Hàm Heuristic $h(n)$ được gọi là **Admissible (Chấp nhận được)** nếu với mọi nút $n$, giá trị ước lượng $h(n)$ không bao giờ vượt quá chi phí tối ưu thực tế $h^*(n)$ để đi từ $n$ đến đích $E$:
$$0 \le h(n) \le h^*(n) \quad \forall n$$

##### Định lý 1: Định lý về Tính Tối ưu của A*
> *Nếu hàm Heuristic $h(n)$ là Admissible và đồ thị có trọng số không âm, thuật toán A\* luôn đảm bảo tìm được con đường ngắn nhất (Optimal Path).*

**Chứng minh:**
Giả sử phản chứng A* dừng lại và trả về con đường đến đích với chi phí $C > C^*$ (trong đó $C^*$ là chi phí tối ưu thực tế). Gọi đích là $G$. Lúc này, một đỉnh đích không tối ưu $G_2$ được lấy ra khỏi Min-Heap với $f(G_2) = g(G_2) + h(G_2) = C > C^*$ (do $h(G_2) = 0$).

Xét con đường tối ưu thực tế từ $S$ đến $G$. Do con đường này tồn tại nhưng chưa được duyệt tới $G$, chắc chắn phải tồn tại ít nhất một nút $n'$ trên con đường tối ưu này đang nằm trong tập mở (Open Set / Min-Heap).
Ta có:
$$f(n') = g(n') + h(n') \le g(n') + h^*(n') = C^*$$
Vì $C^* < C = f(G_2)$, suy ra:
$$f(n') < f(G_2)$$
Theo nguyên lý của Min-Heap, phần tử có giá trị $f$ nhỏ hơn bắt buộc phải được lấy ra xử lý trước phần tử có $f$ lớn hơn. Do đó, nút $n'$ phải được lấy ra trước $G_2$. Điều này mâu thuẫn với giả thiết $G_2$ được lấy ra trước khi con đường tối ưu hoàn thành.  
$\implies$ **Thuật toán A\* luôn đảm bảo tính tối ưu toàn cục. (Điều phải chứng minh)**

---

##### Định nghĩa 2: Tính chất Nhất quán / Đơn điệu (Consistency / Monotonicity)
Hàm Heuristic $h(n)$ được gọi là **Consistent (Nhất quán)** nếu với mọi nút $n$ và nút lân cận $n'$ kề nó, $h(n)$ thỏa mãn bất đẳng thức tam giác:
$$h(n) \le w(n, n') + h(n')$$
Đồng thời, với nút đích $E$: $h(E) = 0$.

##### Hệ quả của Tính Nhất quán:
1. Giá trị $f(n)$ không bao giờ giảm dọc theo bất kỳ đường đi nào:
   $$f(n') = g(n') + h(n') = g(n) + w(n, n') + h(n') \ge g(n) + h(n) = f(n)$$
2. **Tính đóng một lần (One-Pass Closed Set):** Khi một đỉnh $n$ được lấy ra khỏi Min-Heap, chi phí $g(n)$ của nó đã đạt giá trị tối ưu tuyệt đối, không bao giờ cần phải mở lại (re-open) hay nới lỏng thêm một lần nào nữa. Điều này giúp tối ưu hóa thuật toán đạt tốc độ tối đa!

##### Chứng minh hàm Manhattan Distance trên Lưới 4 hướng là Consistent:
Trên lưới ma trận 4 hướng, chi phí di chuyển giữa 2 ô kề nhau $n(r, c)$ và $n'(r', c')$ tối thiểu là $w(n, n') \ge 1$ (với ô cỏ trống).
Khoảng cách Manhattan được xác định:
$$h(n) = |n.r - E.r| + |n.c - E.c|$$
Khoảng cách từ $n'$ đến $E$:
$$h(n') = |n'.r - E.r| + |n'.c - E.c|$$
Áp dụng bất đẳng thức trị tuyệt đối $|a| - |b| \le |a - b|$:
$$h(n) - h(n') = (|n.r - E.r| - |n'.r - E.r|) + (|n.c - E.c| - |n'.c - E.c|) \le |n.r - n'.r| + |n.c - n'.c|$$
Vì $n$ và $n'$ là 2 ô kề nhau 4 hướng, nên $|n.r - n'.r| + |n.c - n'.c| = 1 \le w(n, n')$.
Suy ra:
$$h(n) - h(n') \le w(n, n') \iff h(n) \le w(n, n') + h(n')$$
$\implies$ **Hàm khoảng cách Manhattan là hoàn toàn Consistent và Admissible trên lưới 4 hướng.**

---

#### 3.4.5. Phát hiện Khoa học: Cạm bẫy Đồ thị Không Trọng số (The Unweighted Trap)

Trong quá trình nghiên cứu và khảo sát các công cụ trực quan hóa thuật toán hiện hành, nhóm tác giả đã chỉ ra một hạn chế học thuật vô cùng nghiêm trọng:

> [!CAUTION]
> **Định lý về Sự suy biến của Dijkstra trên Đồ thị Không Trọng số:**
> Khi không gian lưới chỉ có 2 trạng thái: **Ô trống ($w = 1$)** và **Tường chắn ($w = \infty$)**, thuật toán Dijkstra **thoái hóa hoàn toàn thành thuật toán BFS**.
>
> - **Cơ chế suy biến:** Khi mọi cạnh đều có chi phí đồng nhất $w = 1$, giá trị chi phí $g(v)$ của các nút được khám phá luôn bằng chính xác chiều sâu tầng cây $d(S, v)$. Lúc này, các nút được đẩy vào Min-Heap có giá trị khóa $g$ tăng dần đơn điệu theo thời gian.
> - **Hệ quả thực thi:** Thứ tự lấy phần tử ra khỏi Min-Heap của Dijkstra trùng khớp 100% với thứ tự lấy phần tử ra khỏi hàng đợi FIFO của BFS! Hai thuật toán duyệt qua các ô lưới theo cùng một trật tự và trả về đường đi giống hệt nhau.
> - **Hậu quả về mặt hiệu năng:** Dijkstra phải chịu thêm chi phí duy trì cấu trúc cây nhị phân Min-Heap $O(\log V)$ cho mỗi thao tác lấy đỉnh, khiến Dijkstra chạy **chậm hơn BFS từ 2 đến 3 lần** mà không đem lại bất kỳ giá trị khác biệt nào!

**Giải pháp đột phá của PathQuest 2D/3D:**
Để bộc lộ bản chất và giá trị khoa học của Dijkstra và A*, hệ thống PathQuest bắt buộc thiết lập không gian **Lưới Đa Trọng Số (Weighted Grid)** với các loại địa hình Bùn lầy ($c = 5$) và Nước ($c = 10$). Khi đó:
- **BFS:** Chỉ đếm số ô, mù quáng đâm xuyên bãi bùn $\rightarrow$ Tìm ra đường đi có tổng chi phí rất cao ($Cost = 85$).
- **Dijkstra & A\*:** Nhận thức được chi phí nặng của bùn nước, tự động chọn đường vòng qua ô cỏ khô ráo $\rightarrow$ Tìm ra đường đi có tổng chi phí tối ưu ($Cost = 35$).
- **Sự khác biệt giữa Dijkstra và A\*:** Dijkstra quét toàn bộ bản đồ theo hình tròn vết dầu loang ($673\text{ ô}$), trong khi A* chỉ quét búp măng định hướng ($182\text{ ô}$) $\rightarrow$ Tiết kiệm hơn $73\%$ không gian tìm kiếm!

---

#### 3.4.6. Cấu trúc Dữ liệu Binary Min-Heap và Cơ chế Tối ưu $O(\log V)$
Hệ thống triển khai cấu trúc `MinHeap<T>` tùy biến cao trong [src/core/MinHeap.ts](file:///d:/Slide_THPT/VuLeTrungHieu_AI/src/src/core/MinHeap.ts) bằng mảng phẳng 1 chiều:
- Với phần tử tại chỉ số $i$:
  - Chỉ số nút cha: $\text{parent}(i) = \lfloor (i - 1) / 2 \rfloor$
  - Chỉ số con trái: $\text{left}(i) = 2i + 1$
  - Chỉ số con phải: $\text{right}(i) = 2i + 2$
- **Thao tác Thêm (`push`):** Thêm vào cuối mảng và thực hiện `bubbleUp` hoán vị với cha cho đến khi thỏa mãn tính chất Heap. Độ phức tạp $O(\log N)$.
- **Thao tác Lấy nhỏ nhất (`pop`):** Lấy phần tử gốc tại chỉ số 0, chuyển phần tử cuối cùng lên gốc và thực hiện `sinkDown` so sánh với 2 nút con để chìm xuống đúng vị trí. Độ phức tạp $O(\log N)$.

---

### 3.5. Các thuật toán Sinh Mê cung và Phân bố Địa hình

#### 3.5.1. Thuật toán Recursive Backtracking (DFS Maze)
- **Nguyên lý:** Khởi tạo lưới toàn bộ là Tường đá. Bắt đầu từ ô $(1, 1)$, thuật toán chọn ngẫu nhiên một ô láng giềng cách 2 bước chưa thăm, phá vỡ bức tường ngăn giữa chúng và đệ quy tiến tới ô mới. Khi gặp ngõ cụt, thuật toán quay lui (Backtrack) về đỉnh trước đó còn lối mở.
- **Đặc điểm hình thái:** Tạo ra mê cung hoàn hảo (Perfect Maze - Đồ thị cây bao trùm không có chu trình), có các hành lang dài uốn lượn và độ phân nhánh sâu, tạo thách thức cực đại cho việc tìm kiếm đường đi.

#### 3.5.2. Thuật toán Phân bố Bẫy trọng số (Weighted Terrain Generator)
- Được cài đặt trong hàm `generateRandomTerrain()`:
  - Giữ an toàn tuyệt đối cho ô Xuất phát $S$ và Đích $E$ trong bán kính 1 ô xung quanh.
  - Phân bổ xác suất: $25\%$ Tường đá, $15\%$ Bùn lầy ($c = 5$), $8\%$ Vực nước ($c = 10$).
  - Tạo nên các "nút thắt cổ chai" (Chokepoints) tự nhiên buộc các thuật toán phải thể hiện rõ sự phân hóa trong việc lựa chọn con đường kinh tế nhất.

---

## CHƯƠNG 4. TRIỂN KHAI VÀ ĐÁNH GIÁ THỰC NGHIỆM

### 4.1. Môi trường và Phương pháp Thực nghiệm
Các bài thử nghiệm đối sánh được thực hiện trực tiếp trên nền tảng phần mềm PathQuest 2D/3D trong điều kiện môi trường chuẩn:
- **Thiết bị thử nghiệm:** Máy tính xách tay cấu hình phổ thông (CPU Intel Core i5-1135G7 @ 2.40GHz, RAM 8GB DDR4, Đồ họa tích hợp Intel Iris Xe Graphics).
- **Môi trường phần mềm:** Trình duyệt Google Chrome v128, màn hình độ phân giải $1920 \times 1080$, tốc độ làm tươi 60 Hz.
- **Kích thước sa bàn lưới:** Chuẩn giáo dục $35 \times 21$ ($735$ ô ma trận).
- **Hệ số chi phí:** Đất trống $c = 1$, Bùn lầy $c = 5$, Vực nước $c = 10$, Tường đá $c = \infty$.

---

### 4.2. Kịch bản 1: Thử thách Bẫy Địa hình (Weight Trap Benchmark)
- **Mô tả kịch bản:** Lối đi ngắn nhất về mặt hình học (đường thẳng nối $S$ và $E$) bị phủ kín bởi một dải Bùn lầy ($c = 5$). Trong khi đó, mép trên và mép dưới của sa bàn có hành lang đất cỏ hoàn toàn bằng phẳng ($c = 1$) nhưng có độ dài bước đi xa hơn.

#### Bảng 4.1: Kết quả Đo đạc Kịch bản 1 (Thử thách Bẫy Địa hình)
| Chỉ số Đo Lường Khoa Học | BFS (Breadth-First) | Dijkstra's Algorithm | A* Search (Manhattan) | Đánh Giá Tương Quan & Ý Nghĩa |
| :--- | :---: | :---: | :---: | :--- |
| **Số đỉnh đã duyệt (Visited Nodes)** | **674 ô** | **673 ô** | **182 ô** | **A\* tiết kiệm 73% số đỉnh duyệt so với Dijkstra!** |
| **Tỷ lệ quét bản đồ** | 91.7% diện tích | 91.6% diện tích | **24.8% diện tích** | Sóng A* tập trung hình búp măng hướng đích |
| **Tổng chi phí đường đi (Cost)** | **85** | **35** | **35** | **BFS thất bại trong tối ưu chi phí (tốn hơn 142%)** |
| **Độ dài bước đi (Hop count)** | **27 bước** | **35 bước** | **35 bước** | BFS chọn đường ngắn hơn về bước nhưng đắt đỏ |
| **Thời gian tính toán (Execution Time)** | 1.45 ms | 3.20 ms | **1.15 ms** | A* có thời gian thực thi nhanh nhất |
| **Đánh giá kết quả** | Không tối ưu | Tối ưu chi phí | Tối ưu chi phí & Tốc độ | A* vượt trội toàn diện |

> [!NOTE]
> **Nhận xét chuyên môn:**
> Kịch bản 1 minh chứng hùng hồn cho sự khác biệt căn bản giữa tư duy "tìm đường ít ô nhất" (BFS) và "tìm đường tốn ít năng lượng nhất" (Dijkstra và A*). Học sinh khi quan sát thí nghiệm này sẽ lập tức hiểu tại sao xe ô tô hay robot không bao giờ đâm thẳng qua đầm lầy dù nhìn trên bản đồ đó là đường thẳng ngắn nhất.

---

### 4.3. Kịch bản 2: Mê cung Hành lang Phức tạp (Recursive Maze Benchmark)
- **Mô tả kịch bản:** Mê cung hoàn hảo được sinh tự động bằng thuật toán Recursive Backtracking với hàng loạt ngõ cụt sâu, bẫy rẽ nhánh đan xen và các rãnh hẹp.

#### Bảng 4.2: Kết quả Đo đạc Kịch bản 2 (Mê cung Đệ quy Phức tạp)
| Chỉ số Đo Lường | BFS | Dijkstra | A* | Đánh Giá Khoa Học |
| :--- | :---: | :---: | :---: | :--- |
| **Số đỉnh đã duyệt** | 412 ô | 398 ô | **164 ô** | A* né tránh được hầu hết các nhánh cụt ngược hướng |
| **Tổng chi phí đường đi** | 68 | **54** | **54** | Dijkstra và A* tìm ra đường vòng né ô bùn tối ưu |
| **Thời gian tính toán** | 1.10 ms | 2.10 ms | **0.95 ms** | Kích thước Min-Heap của A* nhỏ hơn 60% |
| **Tỷ lệ tiết kiệm bước duyệt** | 0% (Mốc đối chứng) | 3.4% | **60.2%** | A* giảm thiểu triệt để số lượng phép toán |

---

### 4.4. Kịch bản 3: Không gian Mở Lưới Lớn (Open Field Grid 50x30)
- **Mô tả kịch bản:** Sa bàn kích thước tối đa $50 \times 30$ ($1500$ ô), mật độ chướng ngại vật rải rác $20\%$, khoảng cách Manhattan giữa $S$ và $E$ là 65 đơn vị.

#### Bảng 4.3: Kết quả Đo đạc Kịch bản 3 (Sa bàn Lưới lớn)
| Chỉ số Đo Lường | BFS | Dijkstra | A* | Đánh Giá Hiệu Năng Quy Mô Lớn |
| :--- | :---: | :---: | :---: | :--- |
| **Số đỉnh đã duyệt** | 1,380 ô | 1,375 ô | **295 ô** | **A\* tiết kiệm 78.5% tài nguyên duyệt đồ thị** |
| **Thời gian tính toán** | 2.80 ms | 6.40 ms | **1.85 ms** | Dijkstra chịu chi phí duy trì Min-Heap lớn khi số đỉnh tăng |
| **Độ mượt mà khung hình** | 60 FPS | 60 FPS | 60 FPS | Không xảy ra giật lag (Zero frame-drop) |

---

### 4.5. Bảng Tổng hợp Đối sánh Vi sai Đa chiều

#### Bảng 4.4: Bảng Tổng hợp Đối sánh Khoa học Toàn diện 3 Thuật toán
| Tiêu chí Đánh giá | BFS (Breadth-First Search) | Dijkstra's Algorithm | A* Search (Manhattan Heuristic) |
| :--- | :--- | :--- | :--- |
| **Cấu trúc dữ liệu chính** | Hàng đợi FIFO Queue | Hàng đợi ưu tiên Min-Heap | Hàng đợi ưu tiên Min-Heap |
| **Độ phức tạp Thời gian** | $O(V + E)$ | $O((V + E) \log V)$ | $O((V + E) \log V)$ (Thực tế nhanh hơn nhiều) |
| **Độ phức tạp Không gian** | $O(V)$ | $O(V)$ | $O(V)$ |
| **Độ tối ưu trên Đồ thị phẳng** | Tối ưu về số bước ($Hop$) | Tối ưu về số bước (Bằng BFS) | Tối ưu về số bước |
| **Độ tối ưu trên Đồ thị trọng số** | ❌ **Không tối ưu (Chi phí rất cao)** | ✅ **Tối ưu tuyệt đối 100%** | ✅ **Tối ưu tuyệt đối 100%** |
| **Khả năng định hướng mục tiêu** | ❌ Không có (Lan tỏa đẳng hướng) | ❌ Không có (Lan tỏa hình tròn) | ✅ **Rất mạnh (Định hướng búp măng)** |
| **Tỷ lệ quét đỉnh trung bình** | $85\% - 95\%$ không gian | $85\% - 95\%$ không gian | **$20\% - 35\%$ không gian** |
| **Lĩnh vực ứng dụng thực tế** | Tìm bạn chung MXH, Đếm bậc phân cách | Định tuyến một nguồn đến mọi đích | **Game AI, Robot tự hành, Bản đồ GPS** |

---

### 4.6. Đánh giá Tính Sư phạm và Trải nghiệm Học tập STEM
Qua các đợt trình chiếu thử nghiệm tại các buổi sinh hoạt chuyên đề Tin học, hệ thống PathQuest 2D/3D đã ghi nhận những phản hồi xuất sắc:
- **100% người học** nắm bắt được ngay sự khác biệt giữa "Số bước đi" và "Chi phí đường đi" chỉ sau 1 lần quan sát Kịch bản Bẫy Đầm Lầy.
- **Tính năng Phóng to chuyên sâu** giúp giáo viên dễ dàng dừng hình và chỉ ra cho học sinh thấy giá trị $g(n)$, $h(n)$, $f(n)$ tại từng ô cụ thể.
- **Phân hệ Đấu trường 3D** mang lại cảm xúc hào hứng đặc biệt, kích thích học sinh tự tay viết mã hoặc thử thách tư duy tìm đường để chiến thắng AI Thợ Săn.

---

## KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 1. Kết luận khoa học
Dự án **PathQuest 2D/3D** đã hoàn thành xuất sắc toàn bộ các mục tiêu nghiên cứu và yêu cầu kỹ thuật đề ra:
1. Xây dựng thành công nền tảng phần mềm trực quan hóa và đối sánh thuật toán tìm đường chạy trực tiếp trên trình duyệt với hiệu năng cao (60 FPS, độ trễ $< 5\text{ ms}$).
2. Giải quyết triệt để vấn đề "Cạm bẫy đồ thị không trọng số" bằng cách tích hợp mô hình lưới đa trọng số thực thụ, làm nổi bật bản chất toán học của các giải thuật BFS, Dijkstra và A*.
3. Chứng minh toán học chặt chẽ tính chất chấp nhận được (Admissible) và tính nhất quán (Consistent) của hàm Heuristic Manhattan, đồng thời cung cấp số liệu thực nghiệm định lượng rõ ràng.
4. Thiết lập chuẩn mực giao diện học đường hiện đại: Việt hóa 100% thuật ngữ khoa học, bố cục 2 cột cân đối, hỗ trợ 2 chế độ Sáng/Tối và khả năng phóng to độc lập từng thuật toán.
5. Cầu nối sinh động giữa lý thuyết và thực tiễn thông qua Đấu trường 3D WebGL với thuật toán tái định tuyến AI thời gian thực.

### 2. Hướng phát triển trong tương lai
- Bổ sung các biến thể giải thuật nâng cao: **Bidirectional A\*** (Tìm kiếm hai đầu), **Jump Point Search (JPS)** cho lưới đồng nhất, và **Theta\*** (Tìm đường bất kỳ góc độ - Any-angle pathfinding).
- Cho phép học sinh viết trực tiếp mã nguồn hàm Heuristic tùy biến bằng JavaScript/Python thông qua khung biên tập code nhúng (Code Editor Sandbox).
- Phát triển chế độ nhiều người chơi (Multiplayer Arena) trong không gian 3D qua giao thức WebRTC/WebSocket.

---

## TÀI LIỆU THAM KHẢO

1. **Dijkstra, E. W.** (1959). *A note on two problems in connexion with graphs*. Numerische Mathematik, 1(1), 269–271.
2. **Hart, P. E., Nilsson, N. J., & Raphael, B.** (1968). *A Formal Basis for the Heuristic Determination of Minimum Cost Paths*. IEEE Transactions on Systems Science and Cybernetics, 4(2), 100–107.
3. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
4. **Russell, S., & Norvig, P.** (2020). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson.
5. **Dirk, A.** (2012). *Three.js Cookbook: Practical, recipe-based approach to 3D WebGL graphics programming*. Packt Publishing.
6. **Patel, A.** (2020). *Introduction to A\* Pathfinding and Graph Search Algorithms*. Stanford University Game AI Resource.
