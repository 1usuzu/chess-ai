function getPieceBaseValue(type) {
    const baseValues = {
        p: 10, n: 30, b: 30, r: 50, q: 90, k: 900
    };
    return baseValues[type] || 0;
}

// Piece-square tables (giá trị vị trí theo loại quân, ví dụ ở trung tâm tốt hơn)
const pieceSquareTables = {
    p: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5],
        [1, 1, 2, 3, 3, 2, 1, 1],
        [0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5],
        [0, 0, 0, 2, 2, 0, 0, 0],
        [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
        [0.5, 1, 1, -2, -2, 1, 1, 0.5],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    n: [
        [-5, -4, -3, -3, -3, -3, -4, -5],
        [-4, -2, 0, 0, 0, 0, -2, -4],
        [-3, 0, 1, 1.5, 1.5, 1, 0, -3],
        [-3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3],
        [-3, 0, 1.5, 2, 2, 1.5, 0, -3],
        [-3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3],
        [-4, -2, 0, 0.5, 0.5, 0, -2, -4],
        [-5, -4, -3, -3, -3, -3, -4, -5]
    ],
    b: [
        [-2, -1, -1, -1, -1, -1, -1, -2],
        [-1, 0, 0, 0, 0, 0, 0, -1],
        [-1, 0, 0.5, 1, 1, 0.5, 0, -1],
        [-1, 0.5, 0.5, 1, 1, 0.5, 0.5, -1],
        [-1, 0, 1, 1, 1, 1, 0, -1],
        [-1, 1, 1, 1, 1, 1, 1, -1],
        [-1, 0.5, 0, 0, 0, 0, 0.5, -1],
        [-2, -1, -1, -1, -1, -1, -1, -2]
    ],
    r: [
        [0, 0, 0, 0.5, 0.5, 0, 0, 0],
        [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
        [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
        [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
        [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
        [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
        [0.5, 1, 1, 1, 1, 1, 1, 0.5],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    q: [
        [-2, -1, -1, -0.5, -0.5, -1, -1, -2],
        [-1, 0, 0, 0, 0, 0, 0, -1],
        [-1, 0, 0.5, 0.5, 0.5, 0.5, 0, -1],
        [-0.5, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
        [0, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
        [-1, 0.5, 0.5, 0.5, 0.5, 0.5, 0, -1],
        [-1, 0, 0.5, 0, 0, 0, 0, -1],
        [-2, -1, -1, -0.5, -0.5, -1, -1, -2]
    ],
    k: [
        [-3, -4, -4, -5, -5, -4, -4, -3],
        [-3, -4, -4, -5, -5, -4, -4, -3],
        [-3, -4, -4, -5, -5, -4, -4, -3],
        [-3, -4, -4, -5, -5, -4, -4, -3],
        [-2, -3, -3, -4, -4, -3, -3, -2],
        [-1, -2, -2, -2, -2, -2, -2, -1],
        [2, 2, 0, 0, 0, 0, 2, 2],
        [2, 3, 1, 0, 0, 1, 3, 2]
    ]
};

function getPieceSquareValue(piece, x, y) {
    const table = pieceSquareTables[piece.type];
    if (!table) return 0;
    return piece.color === 'w' ? table[x][y] : -table[7 - x][y];
}

function isCenterSquare(x, y) {
    return (x >= 3 && x <= 4) && (y >= 3 && y <= 4);
}

function isKingSafe(x, y, piece) {
    return piece.type === 'k' &&
        ((piece.color === 'w' && x === 7 && (y === 0 || y === 7)) ||
         (piece.color === 'b' && x === 0 && (y === 0 || y === 7)));
}

function isPawnShieldingKing(x, y, piece, board) {
    if (piece.type !== 'k') return false;
    const direction = piece.color === 'w' ? -1 : 1;
    const row = x + direction;

    for (let col = y - 1; col <= y + 1; col++) {
        if (row < 0 || row > 7 || col < 0 || col > 7) continue;
        const p = board[row][col];
        if (p && p.type === 'p' && p.color === piece.color) return true;
    }
    return false;
}

function findKingPosition(color, board) {
    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++)
            if (board[x][y]?.type === 'k' && board[x][y].color === color)
                return { x, y };
    return null;
}

function getPawnBonus(x, color) {
    return color === 'w' ? (6 - x) : (x - 1);
}

function getPieceValue(piece, x, y, board, bishopCount) {
    if (!piece) return 0;
    let value = getPieceBaseValue(piece.type);
    value += getPieceSquareValue(piece, x, y);

    if (isCenterSquare(x, y)) value += 1;

    if ((piece.color === 'w' && x < 6) || (piece.color === 'b' && x > 1)) {
        if (['n', 'b', 'q'].includes(piece.type)) value += 1;
    }

    if ((piece.color === 'w' && x === 7) || (piece.color === 'b' && x === 0)) {
        if (['n', 'b', 'q', 'r'].includes(piece.type)) value -= 1.5;
    }

    if (piece.type === 'p') {
        value += getPawnBonus(x, piece.color);
        if ((piece.color === 'w' && x <= 3) || (piece.color === 'b' && x >= 4)) value += 0.5;
    }

    if (piece.type === 'k') {
        if (isKingSafe(x, y, piece)) value += 10;
        if (isPawnShieldingKing(x, y, piece, board)) value += 5;
        if (isCenterSquare(x, y)) value -= 7;
    }

    if (piece.type === 'b' && bishopCount[piece.color] === 2) value += 0.5;

    // Gần quân mình (đã sửa kiểm tra biên)
    let nearbyFriend = 0;
    for (let dx of [-1, 0, 1])
        for (let dy of [-1, 0, 1])
            if (dx || dy) {
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                    if (board[nx][ny]?.color === piece.color) nearbyFriend++;
                }
            }

    if (nearbyFriend === 0) value -= 1.5;
    else if (nearbyFriend > 1) value += 0.5;

    // Đe doạ vua địch
    const enemyKing = findKingPosition(piece.color === 'w' ? 'b' : 'w', board);
    if (enemyKing && ['q', 'r', 'b', 'n'].includes(piece.type)) {
        const dist = Math.abs(enemyKing.x - x) + Math.abs(enemyKing.y - y);
        if (dist <= 3) value += 0.5;
    }

    // Tấn công quân mạnh hơn (đã sửa kiểm tra biên)
    for (let dx of [-1, 0, 1])
        for (let dy of [-1, 0, 1])
            if (dx || dy) {
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                    const target = board[nx][ny];
                    if (target && target.color !== piece.color) {
                        if (getPieceBaseValue(piece.type) <= getPieceBaseValue(target.type)) {
                            value += 1;
                        }
                    }
                }
            }

    return (piece.color === 'w' ? 1 : -1) * value;
}

// Thêm cache cho evaluateBoard
let evaluationCache = new Map();

// Hàm tạo hash nhanh cho board
function createBoardHash(board) {
    let hash = '';
    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++) {
            const p = board[x][y];
            hash += p ? p.type + p.color : '.';
        }
    return hash;
}

// Hàm đánh giá nhanh (chỉ tính material)
function quickEvaluate(board) {
    let score = 0;
    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++) {
            const piece = board[x][y];
            if (piece) score += (piece.color === 'w' ? 1 : -1) * getPieceBaseValue(piece.type);
        }
    return score;
}

// Dọn dẹp cache khi quá lớn
function clearEvaluationCache() {
    if (evaluationCache.size > 10000) evaluationCache.clear();
}

// Nâng cấp evaluateBoard với cache
function evaluateBoard(board) {
    const hash = createBoardHash(board);
    if (evaluationCache.has(hash)) return evaluationCache.get(hash);

    let score = 0;
    const bishopCount = { w: 0, b: 0 };

    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++) {
            const piece = board[x][y];
            if (piece?.type === 'b') bishopCount[piece.color]++;
        }

    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++) {
            const piece = board[x][y];
            if (piece) score += getPieceValue(piece, x, y, board, bishopCount);
        }

    evaluationCache.set(hash, score);
    return score;
}

module.exports = { 
    evaluateBoard, 
    getPieceBaseValue, 
    clearEvaluationCache, 
    quickEvaluate 
};