import React from 'react';
import { difficulties } from '../data/difficulty';
import type { DifficultyLevel } from '../types/game.types';
import './DifficultySelector.css';

interface Props {
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
  onBackToMapSelector: () => void;  // Добавляем пропс для возврата к выбору карты
}

export const DifficultySelector: React.FC<Props> = ({ onSelectDifficulty, onBackToMapSelector }) => {
  return (
    <div className="difficulty-selector">
      <button className="back-button" onClick={onBackToMapSelector}>
        ← Назад к картам
      </button>
      <h2 className="selector-title">ВЫБЕРИТЕ СЛОЖНОСТЬ</h2>
      <div className="difficulties-grid">
        {difficulties.map((diff) => (
          <button
            key={diff.id}
            className="difficulty-card"
            onClick={() => onSelectDifficulty(diff)}
          >
            <h3 className="difficulty-name">{diff.name}</h3>
            <div className="difficulty-stats">
              <div>⚡ Скорость: {Math.round(1000 / diff.speedMs)} шагов/сек</div>
              <div>🐍 Стартовая длина: {diff.startLength}</div>
              <div>💰 Множитель очков: ×{diff.scoreMultiplier}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};