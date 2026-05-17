import { describe, it, expect } from 'vitest';
import { generateRandomMap } from './MapGenerator';

describe('mapGenerator', () => {
  it('should generate a map with specified dimensions', () => {
    const obstacles = generateRandomMap(20, 20);
    expect(obstacles).toBeInstanceOf(Array);
    obstacles.forEach(obs => {
      expect(obs.x).toBeGreaterThanOrEqual(0);
      expect(obs.x).toBeLessThan(20);
      expect(obs.y).toBeGreaterThanOrEqual(0);
      expect(obs.y).toBeLessThan(20);
    });
  });
  
  it('should not place obstacles on borders', () => {
    const obstacles = generateRandomMap(20, 20);
    obstacles.forEach(obs => {
      expect(obs.x).not.toBe(0);
      expect(obs.x).not.toBe(19);
      expect(obs.y).not.toBe(0);
      expect(obs.y).not.toBe(19);
    });
  });
  
  it('should return array of obstacles', () => {
    const obstacles = generateRandomMap(20, 20);
    expect(Array.isArray(obstacles)).toBe(true);
  });
});