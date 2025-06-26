// Quản lý trạng thái trò chơi
export class GameState {
  static GAME_STATUS = {
    PLAYING: 'playing',
    CHECK: 'check',
    CHECKMATE: 'checkmate',
    STALEMATE: 'stalemate',
    DRAW: 'draw'
  };

  static PIECE_VALUES = {
    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0,
    'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0
  };

  static evaluatePosition(board) {
    let score = 0;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const value = this.PIECE_VALUES[piece];
          score += piece === piece.toUpperCase() ? value : -value;
        }
      }
    }
    
    return score;
  }

  static isGameOver(gameStatus) {
    return [
      this.GAME_STATUS.CHECKMATE,
      this.GAME_STATUS.STALEMATE,
      this.GAME_STATUS.DRAW
    ].includes(gameStatus);
  }

  static getWinner(gameStatus, currentPlayer) {
    if (gameStatus === this.GAME_STATUS.CHECKMATE) {
      return currentPlayer === 'white' ? 'black' : 'white';
    }
    return null; // Draw or game not over
  }

  static isInsufficientMaterial(board) {
    const pieces = this.countPieces(board);
    
    // King vs King
    if (pieces.total === 2) return true;
    
    // King + Bishop vs King or King + Knight vs King
    if (pieces.total === 3) {
      return pieces.whiteBishops === 1 || pieces.blackBishops === 1 ||
             pieces.whiteKnights === 1 || pieces.blackKnights === 1;
    }
    
    // King + Bishop vs King + Bishop (same color squares)
    if (pieces.total === 4 && pieces.whiteBishops === 1 && pieces.blackBishops === 1) {
      return this.bishopsOnSameColorSquares(board);
    }
    
    return false;
  }

  static countPieces(board) {
    const count = {
      total: 0,
      whitePawns: 0, blackPawns: 0,
      whiteRooks: 0, blackRooks: 0,
      whiteKnights: 0, blackKnights: 0,
      whiteBishops: 0, blackBishops: 0,
      whiteQueens: 0, blackQueens: 0,
      whiteKings: 0, blackKings: 0
    };

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          count.total++;
          const isWhite = piece === piece.toUpperCase();
          const pieceType = piece.toLowerCase();
          
          switch (pieceType) {
            case 'p': isWhite ? count.whitePawns++ : count.blackPawns++; break;
            case 'r': isWhite ? count.whiteRooks++ : count.blackRooks++; break;
            case 'n': isWhite ? count.whiteKnights++ : count.blackKnights++; break;
            case 'b': isWhite ? count.whiteBishops++ : count.blackBishops++; break;
            case 'q': isWhite ? count.whiteQueens++ : count.blackQueens++; break;
            case 'k': isWhite ? count.whiteKings++ : count.blackKings++; break;
          }
        }
      }
    }

    return count;
  }

  static bishopsOnSameColorSquares(board) {
    let whiteBishopSquareColor = null;
    let blackBishopSquareColor = null;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.toLowerCase() === 'b') {
          const squareColor = (row + col) % 2;
          if (piece === 'B') {
            whiteBishopSquareColor = squareColor;
          } else {
            blackBishopSquareColor = squareColor;
          }
        }
      }
    }

    return whiteBishopSquareColor === blackBishopSquareColor;
  }

  static isFiftyMoveRule(halfMoveClock) {
    return halfMoveClock >= 100;
  }

  static isThreefoldRepetition(moveHistory) {
    if (moveHistory.length < 8) return false;

    const positions = {};
    let currentPosition = this.getInitialPosition();

    for (const move of moveHistory) {
      currentPosition = this.applyMove(currentPosition, move);
      const positionKey = this.getPositionKey(currentPosition);
      
      positions[positionKey] = (positions[positionKey] || 0) + 1;
      
      if (positions[positionKey] >= 3) {
        return true;
      }
    }

    return false;
  }

  static getPositionKey(gameState) {
    return JSON.stringify({
      board: gameState.board,
      currentPlayer: gameState.currentPlayer,
      castlingRights: gameState.castlingRights,
      enPassantTarget: gameState.enPassantTarget
    });
  }

  static getInitialPosition() {
    return {
      board: [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
      ],
      currentPlayer: 'white',
      castlingRights: { K: true, Q: true, k: true, q: true },
      enPassantTarget: null
    };
  }

  static applyMove(gameState, move) {
    // Simplified move application for position tracking
    const newBoard = gameState.board.map(row => [...row]);
    newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]];
    newBoard[move.from[0]][move.from[1]] = null;

    return {
      ...gameState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white'
    };
  }
}