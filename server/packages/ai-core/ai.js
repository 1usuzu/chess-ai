// ai.js

const { Chess } = require('chess.js');
const { minimax } = require('./minimax');

function findBestMove(fen, depth) {
    const game = new Chess(fen);
    const moves = game.moves({ verbose: true });

    let bestMove = null;
    let bestEval = -Infinity;
    const moveScores = [];

    for (const move of moves) {
        game.move(move);
        const eval = minimax(depth - 1, game, -Infinity, Infinity, false);
        game.undo();
        moveScores.push({
            move: `${move.from}${move.to}`,
            score: eval
        });
        if (eval > bestEval) {
            bestEval = eval;
            bestMove = move;
        }
    }

    console.log("Move scores:");
    moveScores.forEach(m => {
        console.log(`${m.move}: ${m.score}`);
    });

    return {
        bestMove: `${bestMove.from}${bestMove.to}`,
        scores: moveScores
    };
}

module.exports = {
    findBestMove
};
