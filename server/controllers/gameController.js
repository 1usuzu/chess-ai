const { findBestMove } = require('../ai-core/ai');

const getAiMove = (req, res) => {
    try {
        const { fen } = req.body;
        if (!fen) {
            return res.status(400).json({ message: 'Không tìm thấy FEN trong yêu cầu' });
        }

        console.log(`Backend đã nhận FEN: ${fen}`);

        const depth = 3;
        const result = findBestMove(fen, depth);

        if (!result || !result.bestMove) {
            return res.status(500).json({ message: 'AI không thể tìm thấy nước đi' });
        }
        
        console.log(`AI tính toán ra nước đi: ${result.bestMove}`);

        res.status(200).json({ move: result.bestMove });

    } catch (error) {
        console.error("Lỗi trong getAiMove controller:", error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

module.exports = { getAiMove };