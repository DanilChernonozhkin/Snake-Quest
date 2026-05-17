import React, { useState } from 'react';
import './StartScreen.css';

interface Props {
  onStart: (name: string) => void;
}

export const StartScreen: React.FC<Props> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="start-screen">
      <div className="start-container">
        {/* Анимированный фон с сеткой */}
        <div className="grid-background"></div>
        
        {/* Неоновые круги */}
        <div className="neon-circle circle-1"></div>
        <div className="neon-circle circle-2"></div>
        <div className="neon-circle circle-3"></div>
        
        {/* Логотип */}
        <div className="logo-container">
          <h1 className="game-title">
            <span className="snake-text">SNAKE</span>
            <span className="quest-text">QUEST</span>
          </h1>
          <div className="title-glow"></div>
        </div>
        
        {/* Декоративная линия */}
        <div className="title-divider">
          <span className="divider-star">✦</span>
          <span className="divider-line"></span>
          <span className="divider-star">✦</span>
        </div>
        
        {/* Форма ввода имени */}
        <div className="input-section">
          <label className="input-label">
            <span className="label-icon">🐍</span>
            Введите имя игрока
            <span className="label-icon">🎮</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="YOUR NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              className="name-input"
              maxLength={20}
              autoFocus
            />
            <div className="input-glow"></div>
          </div>
          <div className="input-hint">
            {name.length > 0 ? (
              <span className="hint-success">✓ Готов к приключениям!</span>
            ) : (
              <span className="hint-warning">⚠ Введите имя чтобы начать</span>
            )}
          </div>
        </div>
        
        {/* Кнопка старта */}
        <button 
          onClick={handleStart} 
          className={`start-btn ${!name.trim() ? 'disabled' : ''}`}
          disabled={!name.trim()}
        >
          <span className="btn-text">НАЧАТЬ ИГРУ</span>
          <span className="btn-icon">▶</span>
          <div className="btn-glow"></div>
        </button>
        
        {/* Управление */}
        <div className="controls-section">
          <div className="controls-title">УПРАВЛЕНИЕ</div>
          <div className="controls-keys">
            <div className="key-row">
              <div className="key">←</div>
              <div className="key">↑</div>
              <div className="key">↓</div>
              <div className="key">→</div>
              <span className="key-or">или</span>
              <div className="key">W</div>
              <div className="key">A</div>
              <div className="key">S</div>
              <div className="key">D</div>
            </div>
            <div className="key-row">
              <div className="key space">␣</div>
              <span className="key-label">Пауза</span>
              <div className="key">P</div>
              <span className="key-label">Пауза</span>
            </div>
          </div>
        </div>
        
        {/* Неоновая подпись */}
        <div className="neon-signature">
          <span className="signature-text">◢ SNAKE QUEST ◣</span>
        </div>
      </div>
    </div>
  );
};