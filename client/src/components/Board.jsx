import React from 'react';
import { Chessboard } from 'react-chessboard';
import styles from './css/Board.module.css';

function Board({ fen, onDrop, playerColor, game, onInvalidMove, activeSquare, setActiveSquare, setLegalSquares }) {
  const legalMoves = {};
  if (activeSquare && game) {
    const moves = game.moves({ square: activeSquare, verbose: true });
    moves.forEach((m) => {
      legalMoves[m.to] = true;
    });
  }

  const highlightStyles = {};
  if (activeSquare) {
    highlightStyles[activeSquare] = {
      backgroundColor: 'rgba(255, 255, 0, 0.4)',
    };
    for (const square of Object.keys(legalMoves)) {
      highlightStyles[square] = {
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
      };
    }
  }

  const handleClick = (square) => {
    if (!activeSquare) {
      const piece = game.get(square);
      const isMyTurn =
        (playerColor === 'white' && game.turn() === 'w') ||
        (playerColor === 'black' && game.turn() === 'b');

      if (piece && piece.color[0] === playerColor[0] && isMyTurn) {
        setActiveSquare(square);
        const moves = game.moves({ square, verbose: true });
        const destinations = moves.map((m) => m.to);
        setLegalSquares(destinations);
      }
    } else {
      let move = null;
      try {
        move = game.move({ from: activeSquare, to: square, promotion: 'q' });
      } catch (error) {
        console.error('Invalid move:', error);
        onInvalidMove();
      }

      if (!move) {
        onInvalidMove();
      }

      setActiveSquare(null);
      setLegalSquares([]);
    }
  };

  return (
    <div className={styles.boardWrapper}>
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation={playerColor}
        boardWidth={450}
        onSquareClick={handleClick}
        customSquareStyles={highlightStyles}
      />
    </div>
  );
}

export default Board;