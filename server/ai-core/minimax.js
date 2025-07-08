const { evaluateBoard } = require('./evaluate');

// ===== QUISCENCE SEARCH (GIỚI HẠN SÂU) =====
function quiescence(game, alpha, beta, isMaximisingPlayer, depth = 0) {
    const MAX_QUIESCENCE_DEPTH = 4;
    if (depth >= MAX_QUIESCENCE_DEPTH) {
        return evaluateBoard(game.board());
    }

    let stand_pat = evaluateBoard(game.board());

    if (isMaximisingPlayer) {
        if (stand_pat >= beta) return beta;
        if (alpha < stand_pat) alpha = stand_pat;
    } else {
        if (stand_pat <= alpha) return alpha;
        if (beta > stand_pat) beta = stand_pat;
    }

    const moves = game.moves({ verbose: true }).filter(m => m.captured);
    for (const move of moves) {
        game.move(move);
        const score = quiescence(game, alpha, beta, !isMaximisingPlayer, depth + 1);
        game.undo();

        if (isMaximisingPlayer) {
            if (score > alpha) alpha = score;
            if (alpha >= beta) break;
        } else {
            if (score < beta) beta = score;
            if (alpha >= beta) break;
        }
    }

    return isMaximisingPlayer ? alpha : beta;
}

// ===== MINIMAX CÓ PHÁT HIỆN CHIẾU HẾT =====
function minimax(depth, game, alpha, beta, isMaximisingPlayer) {
    if (depth === 0) return quiescence(game, alpha, beta, isMaximisingPlayer, 0);

    let moves = game.moves({ verbose: true });
    moves.sort((a, b) => {
        if (a.captured && !b.captured) return -1;
        if (!a.captured && b.captured) return 1;
        if (a.promotion && !b.promotion) return -1;
        if (!a.promotion && b.promotion) return 1;
        return 0;
    });

    if (moves.length === 0) return evaluateBoard(game.board());

    if (isMaximisingPlayer) {
        let maxEval = -Infinity;
        for (const move of moves) {
            game.move(move);

            // ✅ Nếu chiếu hết sau nước đi này → thắng tuyệt đối
            if (game.isCheckmate()) {
                game.undo();
                return Infinity;
            }

            const evalScore = minimax(depth - 1, game, alpha, beta, false);
            game.undo();

            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            game.move(move);

            // ✅ Nếu chiếu hết sau nước đi này → thua tuyệt đối
            if (game.isCheckmate()) {
                game.undo();
                return -Infinity;
            }

            const evalScore = minimax(depth - 1, game, alpha, beta, true);
            game.undo();

            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

module.exports = { minimax };
