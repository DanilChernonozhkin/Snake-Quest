// src/components/ControlsInfo.tsx
import React from 'react';
import styles from './ControlsInfo.css';

export const ControlsInfo: React.FC = () => {
  return (
    <div className={styles.controlsInfo}>
      <div className={styles.controlGroup}>
        <span className={styles.key}>← ↑ ↓ →</span>
        <span>or</span>
        <span className={styles.key}>W A S D</span>
        <span>to move</span>
      </div>
      <div className={styles.controlGroup}>
        <span className={styles.key}>Space</span>
        <span>or</span>
        <span className={styles.key}>P</span>
        <span>to pause</span>
      </div>
    </div>
  );
};