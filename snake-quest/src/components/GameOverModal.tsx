import React from 'react';
import './GameOverModal.css';

interface Props {
  score: number;
  elapsedTime: number;
  playerName: string;
  mapName: string;
  difficulty: string;
  isRandomMap: boolean;
  onRestart: () => void;
  onNewMap: () => void;
  onMainMenu: () => void;
  onSave: () => void;
  onRegenerateMap: () => void;
}

export const GameOverModal: React.FC<Props> = ({
  score,
  elapsedTime,
  playerName,
  mapName,
  difficulty,
  isRandomMap,
  onRestart,
  onNewMap,
  onMainMenu,
  onRegenerateMap,
  onSave,
}) => {
  return (
    <div className="gameover-modal">
      <div className="modal-content">
        <h2 className="gameover-title">ИГРА ОКОНЧЕНА</h2>
        <div className="gameover-stats">
          <div className="stat-row">
            <span>Игрок:</span>
            <span>{playerName}</span>
          </div>
          <div className="stat-row">
            <span>Счет:</span>
            <span className="score-highlight">{score}</span>
          </div>
          <div className="stat-row">
            <span>Время:</span>
            <span>{elapsedTime} секунд</span>
          </div>
          <div className="stat-row">
            <span>Карта:</span>
            <span>{mapName}</span>
          </div>
          <div className="stat-row">
            <span>Сложность:</span>
            <span>{difficulty}</span>
          </div>
        </div>
        <div className="modal-buttons">
          <button onClick={onSave} className="modal-btn save">💾 Сохранить результат</button>
          <button onClick={onRestart} className="modal-btn restart">🔄 Играть снова</button>
          <button onClick={onNewMap} className="modal-btn newmap">🗺️ Выбрать карту</button>
          <button onClick={onMainMenu} className="modal-btn menu">🏠 Главное меню</button>
          {isRandomMap && (
            <button onClick={onRegenerateMap} className="modal-btn regenerate">🎲 Сгенерировать заново</button>
          )}
        </div>
      </div>
    </div>
  );
};