const { Chess } = require('chess.js');
const { minimax } = require('./minimax');
const { evaluateBoard } = require('./evaluate');

function findBestMove(fen, {
    maxDepth = 4,
    timeLimit = 3000,
    aiColor = 'b',
    returnScores = false
} = {}) {
    const game = new Chess(fen);
    const startTime = Date.now();
    let bestMove = null;
    let bestEval = aiColor === 'w' ? -Infinity : Infinity;
    let moveScores = [];

    const isMaximising = aiColor === 'w';

    const moves = game.moves({ verbose: true });

    // Duyệt từ depth = 1 đến maxDepth (iterative deepening)
    for (let depth = 1; depth <= maxDepth; depth++) {
        let currentBestEval = isMaximising ? -Infinity : Infinity;
        let currentBestMoves = [];
        let currentScores = [];

        for (const move of moves) {
            if (Date.now() - startTime > timeLimit) break;

            game.move(move);
            let score = minimax(depth - 1, game, -Infinity, Infinity, !isMaximising);
            game.undo();

            // Nếu là nước chiếu hết → chọn ngay
            if (game.isCheckmate()) {
                score = isMaximising ? Infinity : -Infinity;
            }

            currentScores.push({ move: `${move.from}${move.to}`, score });

            if (isMaximising) {
                if (score > currentBestEval) {
                    currentBestEval = score;
                    currentBestMoves = [move];
                } else if (score === currentBestEval) {
                    currentBestMoves.push(move);
                }
            } else {
                if (score < currentBestEval) {
                    currentBestEval = score;
                    currentBestMoves = [move];
                } else if (score === currentBestEval) {
                    currentBestMoves.push(move);
                }
            }
        }

        if (Date.now() - startTime > timeLimit) break;

        bestEval = currentBestEval;
        bestMove = currentBestMoves.length > 0
            ? currentBestMoves[Math.floor(Math.random() * currentBestMoves.length)]
            : bestMove;
        moveScores = currentScores;
    }

    return {
        bestMove: bestMove ? `${bestMove.from}${bestMove.to}` : null,
        evaluation: bestEval,
        timeUsed: Date.now() - startTime,
        ...(returnScores && { scores: moveScores })
    };
}

module.exports = {
    findBestMove
};
