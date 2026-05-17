import React, { useState } from 'react';
import './StartScreen.css';

interface Props {
  onStart: (name: string) => void;
  onSelectMap: () => void;
}

export const StartScreen: React.FC<Props> = ({ onStart, onSelectMap }) => {
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.trim()) {
      onStart(name.trim());
      onSelectMap();
    }
  };

  return (
    <div className="start-screen">
      <div className="start-container">
        <h1 className="game-title">🐍 SNAKE QUEST</h1>
        <div className="neon-border"></div>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Введите имя игрока"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            className="name-input"
            maxLength={20}
          />
        </div>
        
        <button onClick={handleStart} className="start-btn" disabled={!name.trim()}>
          НАЧАТЬ ИГРУ
        </button>
        
        <div className="controls-hint">
          ← ↑ ↓ → или WASD для управления
        </div>
      </div>
    </div>
  );
};