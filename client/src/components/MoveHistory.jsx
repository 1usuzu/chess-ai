import React from 'react';
import styles from './css/MoveHistory.module.css';

function MoveHistory({ history }) {
  return (
    <div className={styles.historyPanel}>
      <h4>Lịch sử</h4>
      <ol>
        {history.map((move, idx) => (
          <li key={idx}>{move}</li>
        ))}
      </ol>
    </div>
  );
}

export default MoveHistory;