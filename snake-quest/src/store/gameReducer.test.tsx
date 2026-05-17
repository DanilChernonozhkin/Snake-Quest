import { describe, it, expect } from 'vitest';
import { gameReducer, initialState } from './gameReducer';
import { maps } from '../data/maps';
import { difficulties } from '../data/difficulty';

describe('gameReducer', () => {
  it('should return initial state', () => {
    expect(initialState.status).toBe('menu');
    expect(initialState.playerName).toBe('');
    expect(initialState.selectedMap).toBeNull();
    expect(initialState.selectedDifficulty).toBeNull();
  });

  it('should set player name', () => {
    const newState = gameReducer(initialState, { 
      type: 'SET_PLAYER_NAME', 
      payload: 'TestPlayer' 
    });
    expect(newState.playerName).toBe('TestPlayer');
  });

  it('should select map', () => {
    const newState = gameReducer(initialState, { 
      type: 'SELECT_MAP', 
      payload: maps[0] 
    });
    expect(newState.selectedMap).toEqual(maps[0]);
  });

  it('should select difficulty', () => {
    const newState = gameReducer(initialState, { 
      type: 'SELECT_DIFFICULTY', 
      payload: difficulties[0] 
    });
    expect(newState.selectedDifficulty).toEqual(difficulties[0]);
  });

  it('should show map selector', () => {
    const newState = gameReducer(initialState, { 
      type: 'SHOW_MAP_SELECTOR' 
    });
    expect(newState.status).toBe('selectingMap');
  });

  it('should show difficulty selector', () => {
    const newState = gameReducer(initialState, { 
      type: 'SHOW_DIFFICULTY_SELECTOR' 
    });
    expect(newState.status).toBe('selectingDifficulty');
  });

  it('should start game when map and difficulty are selected', () => {
    let state = gameReducer(initialState, { 
      type: 'SELECT_MAP', 
      payload: maps[0] 
    });
    state = gameReducer(state, { 
      type: 'SELECT_DIFFICULTY', 
      payload: difficulties[0] 
    });
    state = gameReducer(state, { type: 'START_GAME' });
    
    expect(state.status).toBe('playing');
    expect(state.snake.length).toBe(difficulties[0].startLength);
    expect(state.score).toBe(0);
  });

  it('should pause game', () => {
    let state = gameReducer(initialState, { type: 'PAUSE_GAME' });
    expect(state.status).toBe('paused');
  });

  it('should update game', () => {
    const newSnake = [{ x: 5, y: 5 }];
    const newFood = { x: 10, y: 10 };
    const newScore = 100;
    
    const newState = gameReducer(initialState, {
      type: 'UPDATE_GAME',
      payload: {
        snake: newSnake,
        food: newFood,
        score: newScore,
        direction: 'RIGHT'
      }
    });
    
    expect(newState.snake).toEqual(newSnake);
    expect(newState.food).toEqual(newFood);
    expect(newState.score).toBe(newScore);
  });
});