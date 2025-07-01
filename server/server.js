const express = require('express');
const cors = require('cors');

// Import router mà chúng ta đã định nghĩa
const gameRoutes = require('./routes/gameRoutes'); 

const app = express();
const PORT = 5001;

// Sử dụng các middleware cần thiết
app.use(cors());
app.use(express.json()); // Rất quan trọng: để server có thể đọc được dữ liệu JSON

// Gắn router vào đường dẫn /api
// Bất kỳ yêu cầu nào tới /api sẽ được chuyển cho gameRoutes xử lý
app.use('/api', gameRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server đã sẵn sàng và đang chạy tại http://localhost:${PORT}`);
});