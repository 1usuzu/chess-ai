// evaluate.js

function getPieceValue(piece, x, y) {
    if (!piece) return 0;

    const baseValues = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
    let value = baseValues[piece.type] || 0;

    if (piece.type === 'p') {
        value += piece.color === 'w' ? (6 - x) : (x - 1);
    }

    return piece.color === 'w' ? value : -value;
}

function evaluateBoard(board) {
    let total = 0;

    const centerSquares = [
        [3, 3], [3, 4],
        [4, 3], [4, 4]
    ];

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            let value = getPieceValue(piece, i, j);

            if (piece && centerSquares.some(([x, y]) => x === i && y === j)) {
                value += piece.color === 'w' ? 10 : -10;
            }

            total += value;
        }
    }

    return Math.round(total);
}

module.exports = {
    evaluateBoard
};
