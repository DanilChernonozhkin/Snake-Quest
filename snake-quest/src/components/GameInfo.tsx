import React from 'react';
import './GameInfo.css';

interface Props {
  score: number;
  bestScore: number;
  difficulty: string;
  playerName: string;
  elapsedTime: number;
}

export const GameInfo: React.FC<Props> = ({ score, bestScore, difficulty, playerName, elapsedTime }) => {
  return (
    <div className="game-info">
      <div className="info-card">
        <span className="info-label">Игрок</span>
        <span className="info-value">{playerName}</span>
      </div>
      <div className="info-card">
        <span className="info-label">Счет</span>
        <span className="info-value neon-text">{score}</span>
      </div>
      <div className="info-card">
        <span className="info-label">Рекорд</span>
        <span className="info-value">{bestScore}</span>
      </div>
      <div className="info-card">
        <span className="info-label">Сложность</span>
        <span className="info-value">{difficulty}</span>
      </div>
      <div className="info-card">
        <span className="info-label">Время</span>
        <span className="info-value">{elapsedTime}с</span>
      </div>
    </div>
  );
};