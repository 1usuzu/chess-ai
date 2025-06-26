import React, { useState } from 'react';
import GameScreen from './screens/GameScreen';
import styles from './styles/App.module.css';

function App() {
  const [screen, setScreen] = useState('home');
  const [mode, setMode] = useState('');
  const [playerColor, setPlayerColor] = useState('white');

  const goHome = () => setScreen('home');

  if (screen === 'home') {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>♟️ Cờ Vua AI</h1>
        <p className={styles.subtitle}>Chọn chế độ chơi</p>

        <div className={styles.modeBoxWrapper}>
          <div onClick={() => { setMode("pvp"); setScreen("chooseColor"); }} className={styles.modeBox}>
            <div className={styles.icon}>👤👤</div>
            <div className={styles.modeTitle}>Người vs Người</div>
          </div>
          <div onClick={() => { setMode("pve"); setScreen("chooseColor"); }} className={styles.modeBox}>
            <div className={styles.icon}>👤🤖</div>
            <div className={styles.modeTitle}>Người vs AI</div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'chooseColor') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Chọn Quân Cờ</h2>
        <p className={styles.subtitle}>Bạn muốn chơi với quân:</p>

        <div className={styles.modeBoxWrapper}>
          <div onClick={() => { setPlayerColor('white'); setScreen('game'); }} className={styles.modeBox}>
            <div className={styles.icon}>⚪</div>
            <div className={styles.modeTitle}>Trắng (đi trước)</div>
          </div>
          <div onClick={() => { setPlayerColor('black'); setScreen('game'); }} className={styles.modeBox}>
            <div className={styles.icon}>⚫</div>
            <div className={styles.modeTitle}>Đen (đi sau)</div>
          </div>
        </div>
      </div>
    );
  }

  return <GameScreen mode={mode} playerColor={playerColor} goHome={goHome} />;
}

export default App;