import { useState, useReducer, useCallback, useRef, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { MapSelector } from './components/MapSelector';
import { DifficultySelector } from './components/DifficultySelector';
import { GameCanvas } from './components/GameCanvas';
import { GameInfo } from './components/GameInfo';
import { GameOverModal } from './components/GameOverModal';
import { Leaderboard } from './components/Leaderboard';
import { gameReducer, initialState } from './store/gameReducer';
import { generateRandomMap } from './utils/MapGenerator';
import { saveLeaderboardEntry } from './utils/leaderboardStorage';
import type { MapPreset, DifficultyLevel, Position } from './types/game.types';
import './App.css';

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const gameLoopRef = useRef<number | null>(null);
  const stateRef = useRef(state);

  // Обновляем ref при изменении состояния
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Функция генерации случайной еды
  const generateRandomFood = useCallback((
    snake: Position[],
    obstacles: Position[],
    width: number,
    height: number
  ): Position => {
    const maxAttempts = 2000;
    for (let i = 0; i < maxAttempts; i++) {
      const food = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
      };
      const isOnSnake = snake.some(seg => seg.x === food.x && seg.y === food.y);
      const isOnObstacle = obstacles.some(obs => obs.x === food.x && obs.y === food.y);
      if (!isOnSnake && !isOnObstacle) return food;
    }
    // Если не нашли свободное место - ищем по порядку
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const isOnSnake = snake.some(seg => seg.x === x && seg.y === y);
        const isOnObstacle = obstacles.some(obs => obs.x === x && obs.y === y);
        if (!isOnSnake && !isOnObstacle) return { x, y };
      }
    }
    return { x: 1, y: 1 };
  }, []);

  // Функция обновления игры
  const updateGame = useCallback(() => {
    const currentState = stateRef.current;
    
    if (currentState.status !== 'playing') return;
    if (!currentState.selectedMap || !currentState.selectedDifficulty) return;
    
    const obstacles = currentState.selectedMap.id === 'random' 
      ? currentState.selectedMap.obstacles 
      : currentState.selectedMap.obstacles;
    
    const newDirection = currentState.nextDirection;
    const head = currentState.snake[0];
    let newHead = { ...head };
    
    switch (newDirection) {
      case 'UP': newHead.y--; break;
      case 'DOWN': newHead.y++; break;
      case 'LEFT': newHead.x--; break;
      case 'RIGHT': newHead.x++; break;
    }
    
    let newSnake = [newHead, ...currentState.snake.slice(0, -1)];
    let newScore = currentState.score;
    let newFood = currentState.food;
    let gameOver = false;
    
    // Проверка столкновения с собой
    if (newSnake.slice(1).some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      gameOver = true;
    }
    
    // Проверка столкновения со стенами
    if (newHead.x < 0 || newHead.x >= currentState.selectedMap.width ||
        newHead.y < 0 || newHead.y >= currentState.selectedMap.height) {
      gameOver = true;
    }
    
    // Проверка столкновения с препятствиями
    if (obstacles.some(obs => obs.x === newHead.x && obs.y === newHead.y)) {
      gameOver = true;
    }
    
    if (gameOver) {
      dispatch({ type: 'GAME_OVER' });
      return;
    }
    
    // Проверка съедания еды
    if (newHead.x === currentState.food.x && newHead.y === currentState.food.y) {
      newSnake.push(currentState.snake[currentState.snake.length - 1]);
      newScore = currentState.score + Math.floor(10 * currentState.selectedDifficulty.scoreMultiplier);
      newFood = generateRandomFood(newSnake, obstacles, currentState.selectedMap.width, currentState.selectedMap.height);
      
      dispatch({
        type: 'UPDATE_GAME',
        payload: {
          snake: newSnake,
          food: newFood,
          score: newScore,
          direction: newDirection,
        }
      });
    } else {
      dispatch({
        type: 'UPDATE_GAME',
        payload: {
          snake: newSnake,
          food: currentState.food,
          score: currentState.score,
          direction: newDirection,
        }
      });
    }
  }, [generateRandomFood]);

  // Игровой цикл
  useEffect(() => {
    if (state.status !== 'playing') {
      if (gameLoopRef.current !== null) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }
    
    if (!state.selectedMap || !state.selectedDifficulty) return;
    
    if (gameLoopRef.current !== null) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    gameLoopRef.current = window.setInterval(() => {
      updateGame();
    }, state.selectedDifficulty.speedMs);
    
    return () => {
      if (gameLoopRef.current !== null) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [state.status, state.selectedMap, state.selectedDifficulty, updateGame]);

 // Обработка клавиатуры (с поддержкой русской раскладки и полей ввода)
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Проверяем, не находится ли фокус в поле ввода
    const target = e.target as HTMLElement;
    const isInputFocused = target.tagName === 'INPUT' || 
                           target.tagName === 'TEXTAREA' || 
                           target.isContentEditable;
    
    // Определяем клавиши управления
    const controlKeys = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'w', 'W', 's', 'S', 'a', 'A', 'd', 'D',
      'ц', 'Ц', 'ф', 'Ф', 'ы', 'Ы', 'в', 'В',
      ' ', 'p', 'P', 'з', 'З'
    ];
    
    const currentState = stateRef.current;
    
    // Если фокус в поле ввода и игра не активна - не перехватываем клавиши
    if (isInputFocused && currentState.status !== 'playing') {
      return; // Позволяем вводить символы в поле
    }
    
    // Предотвращаем прокрутку страницы при нажатии на клавиши управления
    if (controlKeys.includes(e.key)) {
      e.preventDefault();
    }
    
    // Управление змейкой - только когда игра активна
    if (currentState.status === 'playing') {
      // Маппинг клавиш (поддержка английской и русской раскладок)
      const keyMap: Record<string, string> = {
        // Английская раскладка
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
        W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
        // Русская раскладка (цфыв)
        'ц': 'UP', 'Ц': 'UP',      // ц -> W -> UP
        'ф': 'LEFT', 'Ф': 'LEFT',  // ф -> A -> LEFT
        'ы': 'DOWN', 'Ы': 'DOWN',  // ы -> S -> DOWN
        'в': 'RIGHT', 'В': 'RIGHT' // в -> D -> RIGHT
      };
      
      const newDirection = keyMap[e.key];
      if (newDirection) {
        const opposite: Record<string, string> = {
          UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT'
        };
        if (opposite[newDirection] !== currentState.direction) {
          dispatch({ type: 'SET_DIRECTION', payload: newDirection });
        }
        return;
      }
    }
    
    // Обработка паузы - работает в режимах playing И paused
    if (e.key === ' ' || e.key === 'p' || e.key === 'P' || e.key === 'з' || e.key === 'З') {
      e.preventDefault();
      
      if (currentState.status === 'playing') {
        dispatch({ type: 'PAUSE_GAME' });
      } else if (currentState.status === 'paused') {
        dispatch({ type: 'RESUME_GAME' });
      }
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [dispatch]);

  // Рендер экранов
  const renderScreen = () => {
    switch (state.status) {
      case 'menu':
        return <StartScreen onStart={(name: string) => {
          dispatch({ type: 'SET_PLAYER_NAME', payload: name });
          dispatch({ type: 'SHOW_MAP_SELECTOR' });
        }} />;
        
      case 'selectingMap':
        return (
          <MapSelector 
            onSelectMap={(map: MapPreset) => {
              if (map.id === 'random') {
                const obstacles = generateRandomMap(20, 20);
                const randomMap = { ...map, width: 20, height: 20, obstacles };
                dispatch({ type: 'SELECT_MAP', payload: randomMap });
              } else {
                dispatch({ type: 'SELECT_MAP', payload: map });
              }
              dispatch({ type: 'SHOW_DIFFICULTY_SELECTOR' });
            }} 
            onBackToMenu={() => dispatch({ type: 'BACK_TO_MENU' })}
          />
        );
        
      case 'selectingDifficulty':
        return (
          <DifficultySelector 
            onSelectDifficulty={(diff: DifficultyLevel) => {
              dispatch({ type: 'SELECT_DIFFICULTY', payload: diff });
              dispatch({ type: 'START_GAME' });
            }} 
            onBackToMapSelector={() => dispatch({ type: 'SHOW_MAP_SELECTOR' })}
          />
        );
        
      case 'playing':
      case 'paused':
        if (!state.selectedMap || !state.selectedDifficulty) return null;
        const currentObstacles = state.selectedMap.id === 'random' 
          ? state.selectedMap.obstacles 
          : state.selectedMap.obstacles;
        return (
          <div className="game-container">
            <GameInfo
              score={state.score}
              bestScore={state.sessionBest}
              difficulty={state.selectedDifficulty.name}
              playerName={state.playerName}
              elapsedTime={state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0}
            />
            <div style={{ position: 'relative' }}>
              <GameCanvas
                width={state.selectedMap.width}
                height={state.selectedMap.height}
                snake={state.snake}
                food={state.food}
                obstacles={currentObstacles}
                cellSize={25}
              />
              {state.status === 'paused' && (
                <div className="pause-overlay">
                  PAUSED
                  <div className="pause-hint">Нажмите Space или P для продолжения</div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'gameOver':
        return (
          <GameOverModal
            score={state.score}
            elapsedTime={state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0}
            playerName={state.playerName}
            mapName={state.selectedMap?.name ?? ''}
            difficulty={state.selectedDifficulty?.name ?? ''}
            isRandomMap={state.selectedMap?.id === 'random'}
            onRestart={() => dispatch({ type: 'RESTART_GAME' })}
            onNewMap={() => dispatch({ type: 'CLEAR_MAP_AND_DIFFICULTY' })}
            onMainMenu={() => dispatch({ type: 'BACK_TO_MENU' })}
            onRegenerateMap={() => {
              const newObstacles = generateRandomMap(20, 20);
              dispatch({ type: 'REGENERATE_RANDOM_MAP', payload: { obstacles: newObstacles } });
            }}
            onSave={() => {
              if (state.selectedMap && state.selectedDifficulty) {
                saveLeaderboardEntry({
                  id: Date.now().toString(),
                  playerName: state.playerName,
                  score: state.score,
                  mapName: state.selectedMap.name,
                  difficulty: state.selectedDifficulty.name,
                  date: new Date().toISOString(),
                });
              }
              setShowLeaderboard(true);
            }}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <button className="leaderboard-btn" onClick={() => setShowLeaderboard(true)}>
        🏆 Лидеры
      </button>
      {renderScreen()}
      {showLeaderboard && (
        <div className="modal-overlay" onClick={() => setShowLeaderboard(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Leaderboard onClose={() => setShowLeaderboard(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;