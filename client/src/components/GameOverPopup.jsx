import React from 'react';
import styles from './css/GameOverPopup.module.css';

function GameOverPopup({ winner, onRetry }) {
  return (
    <div className={styles.popup}>
      <h2>{winner}</h2>
      <button onClick={onRetry}>Chơi lại</button>
    </div>
  );
}

export default GameOverPopup;