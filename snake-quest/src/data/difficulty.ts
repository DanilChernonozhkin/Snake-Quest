import { DifficultyLevel } from '../types/game.types';

export const difficulties: DifficultyLevel[] = [
  { id: 'easy', name: 'Легкий', speedMs: 200, startLength: 2, scoreMultiplier: 1.0 },
  { id: 'medium', name: 'Средний', speedMs: 150, startLength: 3, scoreMultiplier: 1.25 },
  { id: 'hard', name: 'Сложный', speedMs: 100, startLength: 4, scoreMultiplier: 1.75 },
  { id: 'expert', name: 'Эксперт', speedMs: 70, startLength: 5, scoreMultiplier: 2.25 },
];