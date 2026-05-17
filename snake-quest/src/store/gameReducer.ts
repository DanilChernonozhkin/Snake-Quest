import type { GameState, Position, MapPreset, DifficultyLevel } from '../types/game.types';

export type Action =
  | { type: 'SET_PLAYER_NAME'; payload: string }
  | { type: 'SELECT_MAP'; payload: MapPreset }
  | { type: 'SELECT_DIFFICULTY'; payload: DifficultyLevel }
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'SET_DIRECTION'; payload: string }
  | { type: 'UPDATE_GAME'; payload: { snake: Position[]; food: Position; score: number; direction: string } }
  | { type: 'RESET_GAME' }
  | { type: 'RESTART_GAME' }
  | { type: 'REGENERATE_RANDOM_MAP'; payload: { obstacles: Position[] } }
  | { type: 'BACK_TO_MENU' }
  | { type: 'CLEAR_MAP_AND_DIFFICULTY' }
  | { type: 'SHOW_MAP_SELECTOR' }
  | { type: 'SHOW_DIFFICULTY_SELECTOR' };

export const initialState: GameState = {
  status: 'menu',
  playerName: '',
  selectedMap: null,
  selectedDifficulty: null,
  snake: [{ x: 10, y: 10 }],
  food: { x: 15, y: 10 },
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
  score: 0,
  sessionBest: 0,
  startTime: null,
  elapsedTime: 0,
};

function generateInitialSnake(startLength: number, startX: number, startY: number): Position[] {
  const snake: Position[] = [];
  for (let i = 0; i < startLength; i++) {
    snake.push({ x: startX - i, y: startY });
  }
  return snake;
}

function generateInitialFood(
  obstacles: Position[],
  width: number,
  height: number,
  startX: number,
  startY: number
): Position {
  let food = { x: startX + 2, y: startY };
  let attempts = 0;
  while (obstacles.some(obs => obs.x === food.x && obs.y === food.y) && attempts < 100) {
    food = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
    attempts++;
  }
  return food;
}

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload };
      
    case 'SELECT_MAP':
      return { ...state, selectedMap: action.payload };
      
    case 'SELECT_DIFFICULTY':
      return { ...state, selectedDifficulty: action.payload };
      
    case 'SHOW_MAP_SELECTOR':
      return { ...state, status: 'selectingMap' };
      
    case 'SHOW_DIFFICULTY_SELECTOR':
      return { ...state, status: 'selectingDifficulty' };
      
    case 'START_GAME': {
      if (!state.selectedMap || !state.selectedDifficulty) return state;
      
      const startX = Math.floor(state.selectedMap.width / 2);
      const startY = Math.floor(state.selectedMap.height / 2);
      const startSnake = generateInitialSnake(state.selectedDifficulty.startLength, startX, startY);
      
      const obstacles = state.selectedMap.id === 'random' ? state.selectedMap.obstacles : state.selectedMap.obstacles;
      const firstFood = generateInitialFood(obstacles, state.selectedMap.width, state.selectedMap.height, startX, startY);
      
      return {
        ...state,
        status: 'playing',
        snake: startSnake,
        food: firstFood,
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
        score: 0,
        startTime: Date.now(),
      };
    }
      
    case 'PAUSE_GAME':
      return { ...state, status: 'paused' };
      
    case 'RESUME_GAME':
      return { ...state, status: 'playing' };
      
    case 'GAME_OVER':
      return { ...state, status: 'gameOver' };
      
    case 'SET_DIRECTION':
      return { ...state, nextDirection: action.payload };
      
    case 'UPDATE_GAME':
      return {
        ...state,
        snake: action.payload.snake,
        food: action.payload.food,
        score: action.payload.score,
        direction: action.payload.direction,
        sessionBest: Math.max(state.sessionBest, action.payload.score),
      };
      
    case 'RESET_GAME':
      return { ...initialState, playerName: state.playerName };
      
    case 'RESTART_GAME': {
      if (!state.selectedMap || !state.selectedDifficulty) return state;
      
      const startX = Math.floor(state.selectedMap.width / 2);
      const startY = Math.floor(state.selectedMap.height / 2);
      const startSnake = generateInitialSnake(state.selectedDifficulty.startLength, startX, startY);
      
      const obstacles = state.selectedMap.id === 'random' ? state.selectedMap.obstacles : state.selectedMap.obstacles;
      const firstFood = generateInitialFood(obstacles, state.selectedMap.width, state.selectedMap.height, startX, startY);
      
      return {
        ...state,
        status: 'playing',
        snake: startSnake,
        food: firstFood,
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
        score: 0,
        startTime: Date.now(),
      };
    }
      
    case 'REGENERATE_RANDOM_MAP': {
      if (!state.selectedMap || !state.selectedDifficulty) return state;
      
      const newObstacles = action.payload.obstacles;
      
      const regeneratedMap = { 
        ...state.selectedMap, 
        obstacles: newObstacles,
        width: 20,
        height: 20
      };
      
      const startX = Math.floor(regeneratedMap.width / 2);
      const startY = Math.floor(regeneratedMap.height / 2);
      const startSnake = generateInitialSnake(state.selectedDifficulty.startLength, startX, startY);
      const firstFood = generateInitialFood(newObstacles, regeneratedMap.width, regeneratedMap.height, startX, startY);
      
      return {
        ...state,
        selectedMap: regeneratedMap,
        status: 'playing',
        snake: startSnake,
        food: firstFood,
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
        score: 0,
        startTime: Date.now(),
      };
    }
      
    case 'CLEAR_MAP_AND_DIFFICULTY':
      return {
        ...state,
        selectedMap: null,
        selectedDifficulty: null,
        status: 'selectingMap',
      };
      
    case 'BACK_TO_MENU':
      return { ...initialState, playerName: state.playerName };
      
    default:
      return state;
  }
}