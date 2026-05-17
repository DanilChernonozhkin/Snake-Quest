import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/game.types';
import { loadLeaderboardEntries, clearLeaderboard } from '../utils/leaderboardStorage';
import './Leaderboard.css';

interface Props {
  onClose: () => void;
}

export const Leaderboard: React.FC<Props> = ({ onClose }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');

  useEffect(() => {
    setEntries(loadLeaderboardEntries());
  }, []);

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleClear = () => {
    if (confirm('Очистить таблицу лидеров?')) {
      clearLeaderboard();
      setEntries([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">🏆 ТАБЛИЦА ЛИДЕРОВ</h2>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
      
      <div className="leaderboard-controls">
        <button
          className={`sort-btn ${sortBy === 'score' ? 'active' : ''}`}
          onClick={() => setSortBy('score')}
        >
          📊 По счету
        </button>
        <button
          className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
          onClick={() => setSortBy('date')}
        >
          📅 По дате
        </button>
        <button onClick={handleClear} className="clear-btn">
          🗑️ Очистить
        </button>
      </div>
      
      <div className="leaderboard-list">
        {sortedEntries.length === 0 ? (
          <div className="empty-leaderboard">
            <span className="empty-icon">🎮</span>
            <p>Нет сохраненных результатов</p>
            <span className="empty-hint">Сыграйте игру, чтобы появились рекорды!</span>
          </div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Игрок</th>
                <th>Счет</th>
                <th>Карта</th>
                <th>Сложность</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.slice(0, 10).map((entry, index) => (
                <tr key={entry.id} className={index < 3 ? 'top-three' : ''}>
                  <td className="rank-cell">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `${index + 1}`}
                  </td>
                  <td className="player-cell">{entry.playerName}</td>
                  <td className="score-cell">{entry.score}</td>
                  <td className="map-cell">{entry.mapName}</td>
                  <td className="difficulty-cell">{entry.difficulty}</td>
                  <td className="date-cell">{formatDate(entry.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};