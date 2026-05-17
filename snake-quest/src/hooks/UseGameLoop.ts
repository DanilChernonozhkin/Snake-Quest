import { useEffect, useRef, useCallback } from 'react';
import type { GameState, Position } from '../types/game.types';

interface UseGameLoopProps {
  /** Текущее состояние игры */
  state: GameState;
  /** Функция dispatch для отправки действий */
  dispatch: React.Dispatch<any>;
  /** Препятствия на случайно сгенерированной карте */
  randomMapObstacles: Position[];
  /** Функция генерации случайной еды */
  generateRandomFood: (
    snake: Position[],
    obstacles: Position[],
    width: number,
    height: number
  ) => Position;
}

/**
 * Хук для управления игровым циклом змейки.
 * Обрабатывает движение змейки, проверку столкновений и генерацию еды.
 * 
 * @param props - Параметры хука
 * @param props.state - Текущее состояние игры
 * @param props.dispatch - Функция для отправки действий
 * @param props.randomMapObstacles - Препятствия на случайной карте
 * @param props.generateRandomFood - Функция генерации еды
 * 
 * @example
 * ```tsx
 * useGameLoop({ state, dispatch, randomMapObstacles, generateRandomFood });
 * ```
 */
export function useGameLoop({ state, dispatch, generateRandomFood }: UseGameLoopProps) {
  const gameLoopRef = useRef<number | null>(null);
  const stateRef = useRef<GameState>(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /**
   * Обновляет состояние игры на каждом тике игрового цикла.
   * Вычисляет новую позицию змейки, проверяет столкновения и обрабатывает съедание еды.
   */
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
    
    // Проверка столкновений
    if (newSnake.slice(1).some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      gameOver = true;
    }
    
    if (newHead.x < 0 || newHead.x >= currentState.selectedMap.width ||
        newHead.y < 0 || newHead.y >= currentState.selectedMap.height) {
      gameOver = true;
    }
    
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
  }, [dispatch, generateRandomFood]);

  // Запуск и остановка игрового цикла
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
}