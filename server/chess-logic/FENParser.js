// Tiện ích xử lý FEN (Forsyth-Edwards Notation)
export class FENParser {
  static defaultFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  static fenToGameState(fenStr) {
    try {
      const parts = fenStr.split(' ');
      if (parts.length !== 6) throw new Error('Invalid FEN format');

      const [boardStr, activeColor, castling, enPassant, halfmove, fullmove] = parts;
      
      return {
        board: this.parseBoardFromFEN(boardStr),
        currentPlayer: activeColor === 'w' ? 'white' : 'black',
        castlingRights: this.parseCastlingRights(castling),
        enPassantTarget: this.parseEnPassant(enPassant),
        halfMoveClock: parseInt(halfmove),
        fullMoveNumber: parseInt(fullmove)
      };
    } catch (error) {
      console.error('Error parsing FEN:', error);
      return this.fenToGameState(this.defaultFEN);
    }
  }

  static parseBoardFromFEN(boardStr) {
    const rows = boardStr.split('/');
    const board = [];

    for (let i = 0; i < 8; i++) {
      const row = [];
      let col = 0;

      for (const char of rows[i]) {
        if (isNaN(char)) {
          row.push(char);
          col++;
        } else {
          const emptyCount = parseInt(char);
          for (let j = 0; j < emptyCount; j++) {
            row.push(null);
            col++;
          }
        }
      }
      board.push(row);
    }

    return board;
  }

  static parseCastlingRights(castlingStr) {
    return {
      K: castlingStr.includes('K'),
      Q: castlingStr.includes('Q'),
      k: castlingStr.includes('k'),
      q: castlingStr.includes('q')
    };
  }

  static parseEnPassant(enPassantStr) {
    if (enPassantStr === '-') return null;
    
    const col = enPassantStr.charCodeAt(0) - 97; // a-h to 0-7
    const row = 8 - parseInt(enPassantStr[1]); // 1-8 to 7-0
    
    return [row, col];
  }

  static gameStateToFEN(gameState) {
    const boardStr = this.boardToFENString(gameState.board);
    const activeColor = gameState.currentPlayer === 'white' ? 'w' : 'b';
    const castling = this.castlingRightsToString(gameState.castlingRights);
    const enPassant = this.enPassantToString(gameState.enPassantTarget);
    
    return `${boardStr} ${activeColor} ${castling} ${enPassant} ${gameState.halfMoveClock} ${gameState.fullMoveNumber}`;
  }

  static boardToFENString(board) {
    const rows = [];

    for (let i = 0; i < 8; i++) {
      let row = '';
      let emptyCount = 0;

      for (let j = 0; j < 8; j++) {
        if (board[i][j] === null) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            row += emptyCount;
            emptyCount = 0;
          }
          row += board[i][j];
        }
      }

      if (emptyCount > 0) {
        row += emptyCount;
      }

      rows.push(row);
    }

    return rows.join('/');
  }

  static castlingRightsToString(castlingRights) {
    let result = '';
    if (castlingRights.K) result += 'K';
    if (castlingRights.Q) result += 'Q';
    if (castlingRights.k) result += 'k';
    if (castlingRights.q) result += 'q';
    
    return result || '-';
  }

  static enPassantToString(enPassantTarget) {
    if (!enPassantTarget) return '-';
    
    const [row, col] = enPassantTarget;
    const file = String.fromCharCode(97 + col); // 0-7 to a-h
    const rank = 8 - row; // 7-0 to 1-8
    
    return file + rank;
  }

  static isValidFEN(fenStr) {
    try {
      const parts = fenStr.split(' ');
      if (parts.length !== 6) return false;

      const [boardStr, activeColor, castling, enPassant, halfmove, fullmove] = parts;

      // Validate board
      const rows = boardStr.split('/');
      if (rows.length !== 8) return false;

      for (const row of rows) {
        let count = 0;
        for (const char of row) {
          if (isNaN(char)) {
            if (!'rnbqkpRNBQKP'.includes(char)) return false;
            count++;
          } else {
            count += parseInt(char);
          }
        }
        if (count !== 8) return false;
      }

      // Validate active color
      if (!'wb'.includes(activeColor)) return false;

      // Validate castling
      if (!/^[KQkq-]*$/.test(castling)) return false;

      // Validate en passant
      if (!/^([a-h][36]|-)$/.test(enPassant)) return false;

      // Validate move counters
      if (isNaN(halfmove) || parseInt(halfmove) < 0) return false;
      if (isNaN(fullmove) || parseInt(fullmove) < 1) return false;

      return true;
    } catch (error) {
      return false;
    }
  }
}