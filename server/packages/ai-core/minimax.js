const { evaluateBoard } = require('./evaluate');

//minimax kết hợp cắt tỉa
function minimax(depth, game, alpha, beta, isMaximisingPlayer) {
    if (depth === 0) return evaluateBoard(game.board());

    const moves = game.moves({ verbose: true });

    if (isMaximisingPlayer) {
        let maxEval = -Infinity;
        for (const move of moves) {
            game.move(move);
            const eval = minimax(depth - 1, game, alpha, beta, false);
            game.undo();
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            game.move(move);
            const eval = minimax(depth - 1, game, alpha, beta, true);
            game.undo();
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

module.exports = {
    minimax
};
