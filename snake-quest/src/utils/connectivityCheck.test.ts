import { describe, it, expect } from 'vitest';
import { isReachable } from './ConnectivityCheck';
import type { Position } from '../types/game.types';

describe('connectivityCheck', () => {
  it('should return true for reachable positions on empty grid', () => {
    const obstacles: Position[] = [];
    const start = { x: 1, y: 1 };
    const end = { x: 3, y: 3 };
    
    const result = isReachable(10, 10, obstacles, start, end);
    expect(result).toBe(true);
  });
  
  it('should return false when path is blocked by obstacles', () => {
    const obstacles: Position[] = [
      { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }
    ];
    const start = { x: 1, y: 1 };
    const end = { x: 3, y: 3 };
    
    const result = isReachable(10, 10, obstacles, start, end);
    expect(result).toBe(false);
  });
  
  it('should return true when path exists around obstacles', () => {
    const obstacles: Position[] = [
      { x: 2, y: 1 }, { x: 2, y: 2 }
    ];
    const start = { x: 1, y: 1 };
    const end = { x: 3, y: 3 };
    
    const result = isReachable(10, 10, obstacles, start, end);
    expect(result).toBe(true);
  });
});