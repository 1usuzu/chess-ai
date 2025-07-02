// Entry point cho logic game
import { ChessGame } from './ChessGame.js';
import { FENParser } from './FENParser.js';
import { MoveValidator } from './MoveValidator.js';
import { GameState } from './GameState.js';

export { ChessGame, FENParser, MoveValidator, GameState };

// Tạo instance game mới
export function createChessGame(initialFEN = null) {
  const game = new ChessGame();
  
  if (initialFEN) {
    const gameState = FENParser.fenToGameState(initialFEN);
    game.board = gameState.board;
    game.currentPlayer = gameState.currentPlayer;
    game.castlingRights = gameState.castlingRights;
    game.enPassantTarget = gameState.enPassantTarget;
    game.halfMoveClock = gameState.halfMoveClock;
    game.fullMoveNumber = gameState.fullMoveNumber;
  }
  
  return game;
}

// Utility functions
export const ChessUtils = {
  // Chuyển đổi tọa độ từ algebraic notation (e4) sang array index [4,4]
  algebraicToCoords(algebraic) {
    const col = algebraic.charCodeAt(0) - 97; // a-h to 0-7
    const row = 8 - parseInt(algebraic[1]); // 1-8 to 7-0
    return [row, col];
  },

  // Chuyển đổi tọa độ từ array index [4,4] sang algebraic notation (e4)
  coordsToAlgebraic(row, col) {
    const file = String.fromCharCode(97 + col); // 0-7 to a-h
    const rank = 8 - row; // 7-0 to 1-8
    return file + rank;
  },

  // Kiểm tra nước đi hợp lệ
  isValidMove(game, from, to) {
    const [fromRow, fromCol] = typeof from === 'string' ? this.algebraicToCoords(from) : from;
    const [toRow, toCol] = typeof to === 'string' ? this.algebraicToCoords(to) : to;
    
    return game.isValidMove(fromRow, fromCol, toRow, toCol);
  },

  // Thực hiện nước đi
  makeMove(game, from, to) {
    const [fromRow, fromCol] = typeof from === 'string' ? this.algebraicToCoords(from) : from;
    const [toRow, toCol] = typeof to === 'string' ? this.algebraicToCoords(to) : to;
    
    return game.makeMove(fromRow, fromCol, toRow, toCol);
  },

  // Lấy tất cả nước đi hợp lệ
  getAllValidMoves(game) {
    const moves = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = game.board[row][col];
        if (piece && game.isPieceOfCurrentPlayer(piece)) {
          const validMoves = game.getValidMoves(row, col);
          for (const [toRow, toCol] of validMoves) {
            moves.push({
              from: this.coordsToAlgebraic(row, col),
              to: this.coordsToAlgebraic(toRow, toCol),
              piece: piece
            });
          }
        }
      }
    }
    
    return moves;
  },

  // Kiểm tra xem quân cờ có thuộc về người chơi hiện tại không
  isPieceOfCurrentPlayer(game, piece) {
    if (!piece) return false;
    const isWhite = piece === piece.toUpperCase();
    return (game.currentPlayer === 'white') === isWhite;
  }
};