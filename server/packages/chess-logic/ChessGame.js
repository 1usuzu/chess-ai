// Logic chính cho trò chơi cờ vua
export class ChessGame {
  constructor() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'white';
    this.gameStatus = 'playing';
    this.castlingRights = { K: true, Q: true, k: true, q: true };
    this.enPassantTarget = null;
    this.halfMoveClock = 0;
    this.fullMoveNumber = 1;
    this.moveHistory = [];
  }

  initializeBoard() {
    return [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    if (!piece) return false;

    const isWhite = piece === piece.toUpperCase();
    if ((this.currentPlayer === 'white') !== isWhite) return false;

    const moves = this.getValidMoves(fromRow, fromCol);
    return moves.some(([r, c]) => r === toRow && c === toCol);
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return false;

    const piece = this.board[fromRow][fromCol];
    const capturedPiece = this.board[toRow][toCol];
    
    // Lưu nước đi vào lịch sử
    this.moveHistory.push({
      from: [fromRow, fromCol],
      to: [toRow, toCol],
      piece,
      capturedPiece,
      castlingRights: { ...this.castlingRights },
      enPassantTarget: this.enPassantTarget
    });

    // Thực hiện nước đi
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    // Cập nhật trạng thái
    this.updateGameState(piece, fromRow, fromCol, toRow, toCol);
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    this.updateGameStatus();
    
    return true;
  }

  getValidMoves(row, col) {
    const piece = this.board[row][col];
    if (!piece) return [];

    const pieceType = piece.toLowerCase();
    let moves = [];

    switch (pieceType) {
      case 'p': moves = this.getPawnMoves(row, col); break;
      case 'r': moves = this.getRookMoves(row, col); break;
      case 'n': moves = this.getKnightMoves(row, col); break;
      case 'b': moves = this.getBishopMoves(row, col); break;
      case 'q': moves = this.getQueenMoves(row, col); break;
      case 'k': moves = this.getKingMoves(row, col); break;
    }

    return moves.filter(([toRow, toCol]) => 
      this.isMoveValid(row, col, toRow, toCol));
  }

  getPawnMoves(row, col) {
    const moves = [];
    const piece = this.board[row][col];
    const isWhite = piece === piece.toUpperCase();
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;

    // Di chuyển thẳng
    if (this.isValidPosition(row + direction, col) && !this.board[row + direction][col]) {
      moves.push([row + direction, col]);
      
      // Di chuyển 2 ô từ vị trí ban đầu
      if (row === startRow && !this.board[row + 2 * direction][col]) {
        moves.push([row + 2 * direction, col]);
      }
    }

    // Ăn chéo
    for (const dc of [-1, 1]) {
      const newRow = row + direction;
      const newCol = col + dc;
      if (this.isValidPosition(newRow, newCol)) {
        const targetPiece = this.board[newRow][newCol];
        if (targetPiece && this.isOpponentPiece(targetPiece, isWhite)) {
          moves.push([newRow, newCol]);
        }
        // En passant
        else if (!targetPiece && this.enPassantTarget && 
                 this.enPassantTarget[0] === newRow && this.enPassantTarget[1] === newCol) {
          moves.push([newRow, newCol]);
        }
      }
    }

    return moves;
  }

  getRookMoves(row, col) {
    const moves = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const isWhite = this.board[row][col] === this.board[row][col].toUpperCase();

    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;

      while (this.isValidPosition(r, c)) {
        if (!this.board[r][c]) {
          moves.push([r, c]);
        } else {
          if (this.isOpponentPiece(this.board[r][c], isWhite)) {
            moves.push([r, c]);
          }
          break;
        }
        r += dr;
        c += dc;
      }
    }

    return moves;
  }

  getKnightMoves(row, col) {
    const moves = [];
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    const isWhite = this.board[row][col] === this.board[row][col].toUpperCase();

    for (const [dr, dc] of knightMoves) {
      const r = row + dr;
      const c = col + dc;
      if (this.canMoveTo(r, c, isWhite)) {
        moves.push([r, c]);
      }
    }

    return moves;
  }

  getBishopMoves(row, col) {
    const moves = [];
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    const isWhite = this.board[row][col] === this.board[row][col].toUpperCase();

    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;

      while (this.isValidPosition(r, c)) {
        if (!this.board[r][c]) {
          moves.push([r, c]);
        } else {
          if (this.isOpponentPiece(this.board[r][c], isWhite)) {
            moves.push([r, c]);
          }
          break;
        }
        r += dr;
        c += dc;
      }
    }

    return moves;
  }

  getQueenMoves(row, col) {
    return [...this.getRookMoves(row, col), ...this.getBishopMoves(row, col)];
  }

  getKingMoves(row, col) {
    const moves = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    const isWhite = this.board[row][col] === this.board[row][col].toUpperCase();

    for (const [dr, dc] of directions) {
      const r = row + dr;
      const c = col + dc;
      if (this.canMoveTo(r, c, isWhite)) {
        moves.push([r, c]);
      }
    }

    // Nhập thành
    if (this.canCastle(isWhite, 'kingside')) {
      moves.push([row, col + 2]);
    }
    if (this.canCastle(isWhite, 'queenside')) {
      moves.push([row, col - 2]);
    }

    return moves;
  }

  canCastle(isWhite, side) {
    const row = isWhite ? 7 : 0;
    const kingCol = 4;
    const rookCol = side === 'kingside' ? 7 : 0;
    
    // Kiểm tra quyền nhập thành
    const castlingKey = isWhite ? (side === 'kingside' ? 'K' : 'Q') : (side === 'kingside' ? 'k' : 'q');
    if (!this.castlingRights[castlingKey]) return false;

    // Kiểm tra vua và xe ở đúng vị trí
    const king = this.board[row][kingCol];
    const rook = this.board[row][rookCol];
    if (!king || king.toLowerCase() !== 'k' || !rook || rook.toLowerCase() !== 'r') return false;

    // Kiểm tra các ô giữa trống
    const start = Math.min(kingCol, rookCol) + 1;
    const end = Math.max(kingCol, rookCol);
    for (let col = start; col < end; col++) {
      if (this.board[row][col]) return false;
    }

    // Kiểm tra vua không bị chiếu
    if (this.isKingInCheck(isWhite)) return false;

    return true;
  }

  isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  canMoveTo(row, col, isCurrentPlayerWhite) {
    if (!this.isValidPosition(row, col)) return false;
    const piece = this.board[row][col];
    if (!piece) return true;
    return this.isOpponentPiece(piece, isCurrentPlayerWhite);
  }

  isOpponentPiece(piece, isCurrentPlayerWhite) {
    const isPieceWhite = piece === piece.toUpperCase();
    return isPieceWhite !== isCurrentPlayerWhite;
  }

  isMoveValid(fromRow, fromCol, toRow, toCol) {
    // Tạo bàn cờ giả định
    const originalPiece = this.board[toRow][toCol];
    this.board[toRow][toCol] = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = null;

    const isWhite = this.board[toRow][toCol] === this.board[toRow][toCol].toUpperCase();
    const inCheck = this.isKingInCheck(isWhite);

    // Khôi phục bàn cờ
    this.board[fromRow][fromCol] = this.board[toRow][toCol];
    this.board[toRow][toCol] = originalPiece;

    return !inCheck;
  }

  isKingInCheck(isWhite) {
    const kingPos = this.findKing(isWhite);
    if (!kingPos) return false;
    
    return this.isSquareAttacked(kingPos[0], kingPos[1], !isWhite);
  }

  findKing(isWhite) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.toLowerCase() === 'k' &&
            ((isWhite && piece === 'K') || (!isWhite && piece === 'k'))) {
          return [row, col];
        }
      }
    }
    return null;
  }

  isSquareAttacked(row, col, byWhite) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (piece && ((byWhite && piece === piece.toUpperCase()) || 
                     (!byWhite && piece === piece.toLowerCase()))) {
          const moves = this.getBasicMoves(r, c);
          if (moves.some(([mr, mc]) => mr === row && mc === col)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getBasicMoves(row, col) {
    const piece = this.board[row][col];
    const pieceType = piece.toLowerCase();

    switch (pieceType) {
      case 'p': return this.getPawnAttacks(row, col);
      case 'r': return this.getRookMoves(row, col);
      case 'n': return this.getKnightMoves(row, col);
      case 'b': return this.getBishopMoves(row, col);
      case 'q': return this.getQueenMoves(row, col);
      case 'k': return this.getKingBasicMoves(row, col);
      default: return [];
    }
  }

  getPawnAttacks(row, col) {
    const moves = [];
    const piece = this.board[row][col];
    const isWhite = piece === piece.toUpperCase();
    const direction = isWhite ? -1 : 1;

    for (const dc of [-1, 1]) {
      const newRow = row + direction;
      const newCol = col + dc;
      if (this.isValidPosition(newRow, newCol)) {
        moves.push([newRow, newCol]);
      }
    }

    return moves;
  }

  getKingBasicMoves(row, col) {
    const moves = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    for (const [dr, dc] of directions) {
      const r = row + dr;
      const c = col + dc;
      if (this.isValidPosition(r, c)) {
        moves.push([r, c]);
      }
    }

    return moves;
  }

  updateGameState(piece, fromRow, fromCol, toRow, toCol) {
    // Cập nhật quyền nhập thành
    if (piece.toLowerCase() === 'k') {
      if (piece === 'K') {
        this.castlingRights.K = false;
        this.castlingRights.Q = false;
      } else {
        this.castlingRights.k = false;
        this.castlingRights.q = false;
      }
    }

    if (piece.toLowerCase() === 'r') {
      if (fromRow === 0 && fromCol === 0) this.castlingRights.q = false;
      if (fromRow === 0 && fromCol === 7) this.castlingRights.k = false;
      if (fromRow === 7 && fromCol === 0) this.castlingRights.Q = false;
      if (fromRow === 7 && fromCol === 7) this.castlingRights.K = false;
    }

    // Cập nhật en passant
    this.enPassantTarget = null;
    if (piece.toLowerCase() === 'p' && Math.abs(fromRow - toRow) === 2) {
      this.enPassantTarget = [(fromRow + toRow) / 2, fromCol];
    }

    // Cập nhật half move clock
    if (piece.toLowerCase() === 'p' || this.board[toRow][toCol]) {
      this.halfMoveClock = 0;
    } else {
      this.halfMoveClock++;
    }

    // Cập nhật full move number
    if (this.currentPlayer === 'black') {
      this.fullMoveNumber++;
    }
  }

  updateGameStatus() {
    const isWhiteToMove = this.currentPlayer === 'white';
    
    if (this.isCheckmate(isWhiteToMove)) {
      this.gameStatus = 'checkmate';
    } else if (this.isStalemate(isWhiteToMove)) {
      this.gameStatus = 'stalemate';
    } else if (this.isKingInCheck(isWhiteToMove)) {
      this.gameStatus = 'check';
    } else {
      this.gameStatus = 'playing';
    }
  }

  isCheckmate(isWhiteToMove) {
    if (!this.isKingInCheck(isWhiteToMove)) return false;
    return this.hasNoLegalMoves(isWhiteToMove);
  }

  isStalemate(isWhiteToMove) {
    if (this.isKingInCheck(isWhiteToMove)) return false;
    return this.hasNoLegalMoves(isWhiteToMove);
  }

  hasNoLegalMoves(isWhiteToMove) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && ((isWhiteToMove && piece === piece.toUpperCase()) ||
                     (!isWhiteToMove && piece === piece.toLowerCase()))) {
          const moves = this.getValidMoves(row, col);
          if (moves.length > 0) return false;
        }
      }
    }
    return true;
  }

  isPieceOfCurrentPlayer(piece) {
    if (!piece) return false;
    const isWhite = piece === piece.toUpperCase();
    return (this.currentPlayer === 'white') === isWhite;
  }
}