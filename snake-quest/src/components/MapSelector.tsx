import React, { useState } from 'react';
import { maps } from '../data/maps';
import type { MapPreset } from '../types/game.types';
import './MapSelector.css';

interface Props {
  onSelectMap: (map: MapPreset) => void;
  onBackToMenu: () => void;
}

export const MapSelector: React.FC<Props> = ({ onSelectMap, onBackToMenu }) => {
  const [hoveredRandom, setHoveredRandom] = useState(false);
  
  const randomMap: MapPreset = {
    id: 'random',
    name: 'Случайная генерация',
    width: 20,
    height: 20,
    obstacles: [],
    difficulty: 3,
  };
  
  const allMaps = [...maps, randomMap];

  // Функция для рендеринга точного превью карты
  const renderMapPreview = (map: MapPreset) => {
    // Создаем сетку препятствий
    const grid: boolean[][] = Array(map.height).fill(null).map(() => Array(map.width).fill(false));
    map.obstacles.forEach(obs => {
      if (obs.x >= 0 && obs.x < map.width && obs.y >= 0 && obs.y < map.height) {
        grid[obs.y][obs.x] = true;
      }
    });
    
    // Рассчитываем размер клетки, чтобы заполнить всё окно превью
    const containerSize = 180; // максимальный размер контейнера в px
    const cellSizeByWidth = Math.floor(containerSize / map.width);
    const cellSizeByHeight = Math.floor(containerSize / map.height);
    const cellSize = Math.min(cellSizeByWidth, cellSizeByHeight, 6); // максимум 6px, минимум по расчету
    
    const previewWidth = map.width * cellSize;
    const previewHeight = map.height * cellSize;
    
    return (
      <div className="map-preview-container">
        <div 
          className="map-preview-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${map.width}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${map.height}, ${cellSize}px)`,
            gap: '1px',
            backgroundColor: '#1a1f3e',
            width: `${previewWidth + (map.width - 1)}px`,
            height: `${previewHeight + (map.height - 1)}px`,
          }}
        >
          {grid.map((row, y) => (
            row.map((hasObstacle, x) => (
              <div
                key={`${y}-${x}`}
                className={`preview-cell ${hasObstacle ? 'obstacle' : 'empty'}`}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
                title={`(${x}, ${y})${hasObstacle ? ' - Стена' : ''}`}
              />
            ))
          ))}
        </div>
      </div>
    );
  };

  // Функция для получения цвета сложности
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '#4caf50';
      case 2: return '#ff9800';
      case 3: return '#f44336';
      default: return '#888';
    }
  };

  return (
    <div className="map-selector">
      <button className="back-button" onClick={onBackToMenu}>
        ← Назад в меню
      </button>
      <h2 className="selector-title">ВЫБЕРИТЕ КАРТУ</h2>
      <div className="maps-grid">
        {allMaps.map((map) => {
          const filledStars = Math.max(0, Math.min(3, map.difficulty));
          const emptyStars = Math.max(0, 3 - filledStars);
          const isRandom = map.id === 'random';
          
          return (
            <button
              key={map.id}
              className="map-card"
              onClick={() => onSelectMap(map)}
              onMouseEnter={() => isRandom && setHoveredRandom(true)}
              onMouseLeave={() => isRandom && setHoveredRandom(false)}
            >
              <div className="map-preview">
                {!isRandom ? (
                  renderMapPreview(map)
                ) : (
                  <div className={`random-preview ${hoveredRandom ? 'animated' : ''}`}>
                    <div className="random-content">
                      <div className="random-dice">🎲</div>
                      <div className="random-text">RANDOM MAP</div>
                      <div className="random-dots">
                        <span>●</span>
                        <span>●</span>
                        <span>●</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <h3 className="map-name">{map.name}</h3>
              <div className="map-stats">
                <div className="map-size">
                  <span className="stat-label">Размер:</span>
                  <span className="stat-value">{map.width}×{map.height}</span>
                </div>
                <div className="map-obstacles">
                  <span className="stat-label">Стены:</span>
                  <span className="stat-value">{map.obstacles.length}</span>
                </div>
              </div>
              <div className="map-difficulty-bar">
                <div 
                  className="difficulty-fill" 
                  style={{ 
                    width: `${(map.difficulty / 3) * 100}%`,
                    backgroundColor: getDifficultyColor(map.difficulty)
                  }}
                />
                <div className="difficulty-stars">
                  {'⭐'.repeat(filledStars)}{'☆'.repeat(emptyStars)}
                </div>
              </div>
              <div className="map-description">
                {map.id === 'classic' && 'Классическое поле без препятствий. Идеально для новичков.'}
                {map.id === 'maze' && 'Спиральный лабиринт с выходами по краям. Требует внимания.'}
                {map.id === 'minesfield' && 'Открытое пространство с редкими препятствиями.'}
                {map.id === 'zigzag' && 'Извилистые коридоры для опытных игроков.'}
                {map.id === 'random' && 'Уникальная карта каждый раз. Никогда не скучно!'}
              </div>
              <div className="map-hover-effect" />
            </button>
          );
        })}
      </div>
    </div>
  );
};