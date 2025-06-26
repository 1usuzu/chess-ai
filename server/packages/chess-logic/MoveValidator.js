// Validator cho các nước đi cờ vua
export class MoveValidator {
  static isValidPieceMove(board, fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const pieceType = piece.toLowerCase();
    
    switch (pieceType) {
      case 'p': return this.isValidPawnMove(board, fromRow, fromCol, toRow, toCol);
      case 'r': return this.isValidRookMove(board, fromRow, fromCol, toRow, toCol);
      case 'n': return this.isValidKnightMove(fromRow, fromCol, toRow, toCol);
      case 'b': return this.isValidBishopMove(board, fromRow, fromCol, toRow, toCol);
      case 'q': return this.isValidQueenMove(board, fromRow, fromCol, toRow, toCol);
      case 'k': return this.isValidKingMove(fromRow, fromCol, toRow, toCol);
      default: return false;
    }
  }

  static isValidPawnMove(board, fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const isWhite = piece === piece.toUpperCase();
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;

    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    // Di chuyển thẳng
    if (colDiff === 0) {
      if (rowDiff === direction && !board[toRow][toCol]) {
        return true;
      }
      if (fromRow === startRow && rowDiff === 2 * direction && 
          !board[toRow][toCol] && !board[fromRow + direction][fromCol]) {
        return true;
      }
    }
    // Ăn chéo
    else if (colDiff === 1 && rowDiff === direction) {
      return board[toRow][toCol] !== null;
    }

    return false;
  }

  static isValidRookMove(board, fromRow, fromCol, toRow, toCol) {
    if (fromRow !== toRow && fromCol !== toCol) return false;

    const rowStep = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
    const colStep = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol] !== null) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  }

  static isValidKnightMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

  static isValidBishopMove(board, fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    if (rowDiff !== colDiff) return false;

    const rowStep = toRow > fromRow ? 1 : -1;
    const colStep = toCol > fromCol ? 1 : -1;

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol] !== null) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  }

  static isValidQueenMove(board, fromRow, fromCol, toRow, toCol) {
    return this.isValidRookMove(board, fromRow, fromCol, toRow, toCol) ||
           this.isValidBishopMove(board, fromRow, fromCol, toRow, toCol);
  }

  static isValidKingMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
  }

  static isPathClear(board, fromRow, fromCol, toRow, toCol) {
    const rowStep = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
    const colStep = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol] !== null) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  }

  static isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  static isSameColor(piece1, piece2) {
    if (!piece1 || !piece2) return false;
    return (piece1 === piece1.toUpperCase()) === (piece2 === piece2.toUpperCase());
  }

  static isOpponentPiece(piece, isCurrentPlayerWhite) {
    if (!piece) return false;
    const isPieceWhite = piece === piece.toUpperCase();
    return isPieceWhite !== isCurrentPlayerWhite;
  }
}