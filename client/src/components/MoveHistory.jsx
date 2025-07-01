import React from 'react';
import styles from './css/MoveHistory.module.css';

function MoveHistory({ history, turn }) {
  // Gom lịch sử thành từng cặp trắng-đen
  const pairs = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      white: history[i] || '',
      black: history[i + 1] || '',
    });
  }

  return (
    <div className={styles.historyPanel}>
      <h4>Ghi chú các nước đi</h4>
      <table className={styles.historyTable}>
        <thead>
          <tr>
            <th>Nước</th>
            <th>Trắng</th>
            <th>Đen</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((pair, idx) => (
            <tr key={idx} className={
              (turn === 'w' && idx === pairs.length - 1) ? styles.activeRowWhite :
              (turn === 'b' && idx === pairs.length - 1) ? styles.activeRowBlack : ''
            }>
              <td>{idx + 1}</td>
              <td>{pair.white}</td>
              <td>{pair.black}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MoveHistory;