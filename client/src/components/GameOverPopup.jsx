import React from 'react';
import styles from './css/GameOverPopup.module.css';

function GameOverPopup({ winner, onRetry, customStyle }) {
  return (
    <div className={styles.popup} style={customStyle}>
      <h2 style={{ fontSize: customStyle?.fontSize || '2rem', marginBottom: '1.5rem', fontWeight: 700 }}>{winner}</h2>
      <button
        onClick={onRetry}
        style={{
          fontSize: '1.3rem',
          padding: '0.8rem 2.2rem',
          borderRadius: '12px',
          border: 'none',
          background: '#4e8cff',
          color: '#fff',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
      >
        Chơi lại
      </button>
    </div>
  );
}

export default GameOverPopup;