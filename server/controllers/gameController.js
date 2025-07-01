// Đường dẫn này giả định ai.js nằm trong packages/ai-core so với thư mục server
const { findBestMove } = require('../ai-core/ai');

// Hàm controller mới để xử lý yêu cầu tìm nước đi của AI
const getAiMove = (req, res) => {
    try {
        // 1. Lấy FEN string mà frontend gửi lên
        const { fen } = req.body;
        if (!fen) {
            return res.status(400).json({ message: 'Không tìm thấy FEN trong yêu cầu' });
        }

        console.log(`Backend đã nhận FEN: ${fen}`);

        // 2. Gọi hàm findBestMove từ file ai.js của bạn
        //    Hàm này nhận vào FEN và độ sâu tìm kiếm (depth)
        const depth = 3; // Bạn có thể thay đổi độ sâu để AI mạnh/yếu hơn
        const result = findBestMove(fen, depth);

        if (!result || !result.bestMove) {
            return res.status(500).json({ message: 'AI không thể tìm thấy nước đi' });
        }
        
        console.log(`AI tính toán ra nước đi: ${result.bestMove}`);

        // 3. Trả về nước đi tốt nhất cho frontend
        res.status(200).json({ move: result.bestMove });

    } catch (error) {
        console.error("Lỗi trong getAiMove controller:", error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

module.exports = { getAiMove };