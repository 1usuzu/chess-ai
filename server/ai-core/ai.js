const { Chess } = require('chess.js');
const { minimax } = require('./minimax');
const { getPieceBaseValue } = require('./evaluate');

// AI là quân đen
function findBestMove(fen, depth) {
    const game = new Chess(fen);
    const moves = game.moves({ verbose: true });

    let bestMoves = [];
    let bestEval = Infinity;
    const moveScores = [];

    for (const move of moves) {
        game.move(move);
        try {
            // Đánh giá điểm AI là đen - minimizing
            let evalScore = minimax(depth - 1, game, -Infinity, Infinity, true); // maximizing cho trắng

            // Nếu nước đi dẫn đến chiếu hết
            if (game.isCheckmate()) {
                evalScore = -100000; // Đen chiếu hết => điểm cực thấp (tốt cho đen)
            } else if (game.inCheck()) {
                evalScore -= 5; // Thưởng nhỏ nếu chiếu vua trắng
            }
            moveScores.push({
                move: `${move.from}${move.to}`,
                score: evalScore
            });
            if (evalScore < bestEval) {
                bestEval = evalScore;
                bestMoves = [move];
            } else if (evalScore === bestEval) {
                bestMoves.push(move);
            }
        } finally {
            game.undo();
        }
    }
    // Nếu có nhiều nước tốt nhất, chọn ngẫu nhiên
    const chosenMove = bestMoves.length > 0 ? bestMoves[Math.floor(Math.random() * bestMoves.length)] : null;
    return {
        bestMove: chosenMove ? `${chosenMove.from}${chosenMove.to}` : null,
        scores: moveScores
    };
}

module.exports = {
    findBestMove
};