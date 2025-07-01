# Chess AI Project

## Giới thiệu
Đây là dự án AI chơi cờ vua sử dụng thuật toán Minimax kết hợp cắt tỉa Alpha-Beta, được xây dựng bằng Node.js cho backend và ReactJS cho frontend. Hệ thống cho phép người dùng chơi cờ với AI hoặc với người khác, có giao diện hiện đại, lịch sử nước đi rõ ràng và popup thông báo kết quả.

## Tính năng chính
- AI cờ vua sử dụng Minimax + Alpha-Beta Pruning, move ordering, quiescence search.
- Hàm đánh giá bàn cờ đa yếu tố: giá trị quân, vị trí, cấu trúc tốt, an toàn vua, v.v.
- Giao diện React hiện đại, thân thiện, hiển thị bàn cờ, lịch sử nước đi, popup kết quả.
- Cho phép chọn chế độ chơi (Người vs AI, Người vs Người), chọn màu quân, chơi lại nhanh.
- Backend Node.js xử lý logic AI, giao tiếp với client qua API.

## Cài đặt
1. **Clone repository:**
   ```bash
   git clone <repo-url>
   cd chess-ai-project
   ```
2. **Cài đặt backend:**
   ```bash
   cd server
   npm install
   ```
3. **Cài đặt frontend:**
   ```bash
   cd ../client
   npm install
   ```
4. **Chạy backend:**
   ```bash
   cd ../server
   npm start
   ```
5. **Chạy frontend:**
   ```bash
   cd ../client
   npm start
   ```
6. **Truy cập ứng dụng:**
   Mở trình duyệt và truy cập `http://localhost:3000`

## Cấu trúc thư mục
- `server/ai-core/`: Thuật toán AI, minimax, evaluate, ...
- `server/controllers/`, `server/routes/`, ...: Xử lý API backend
- `client/src/`: Code React giao diện
- `client/src/components/`: Các component giao diện (Board, MoveHistory, Popup, ...)