import React from 'react';
import styles from './css/InvalidMovePopup.module.css';

function InvalidMovePopup({ onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Nước đi không hợp lệ!</h3>
        <p>Vui lòng thử lại một nước đi hợp lệ theo luật cờ vua.</p>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

export default InvalidMovePopup;