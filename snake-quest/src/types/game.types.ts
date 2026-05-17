export type Position = { x: number; y: number };

export type MapPreset = {
  id: string;
  name: string;
  width: number;
  height: number;
  obstacles: Position[];
  difficulty: number;
};

export type DifficultyLevel = {
  id: string;
  name: string;
  speedMs: number;
  startLength: number;
  scoreMultiplier: number;
};

export type LeaderboardEntry = {
  id: string;
  playerName: string;
  score: number;
  mapName: string;
  difficulty: string;
  date: string;
};

export type GameState = {
  status: 'menu' | 'selectingMap' | 'selectingDifficulty' | 'playing' | 'paused' | 'gameOver';
  playerName: string;
  selectedMap: MapPreset | null;
  selectedDifficulty: DifficultyLevel | null;
  snake: Position[];
  food: Position;
  direction: string;
  nextDirection: string;
  score: number;
  sessionBest: number;
  startTime: number | null;
  elapsedTime: number;
};