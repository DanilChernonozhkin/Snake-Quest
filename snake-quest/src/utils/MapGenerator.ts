import type { Position } from '../types/game.types';
import { isReachable } from './ConnectivityCheck';

export function generateRandomMap(width = 20, height = 20): Position[] {
  const obstacles: Position[] = [];
  const fillPercentage = Math.random() * 5 + 10 ;
  const totalCells = width * height;
  const obstacleCount = Math.floor((totalCells * fillPercentage) / 100);
  const useWalls = Math.random() > 0.5;
  
  const isObstacleAt = (x: number, y: number) => {
    return obstacles.some(o => o.x === x && o.y === y);
  };
  
  for (let i = 0; i < obstacleCount; i++) {
    let x, y;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * width);
      y = Math.floor(Math.random() * height);
      attempts++;
      if (attempts > 100) break;
    } while (
      (x < 2 || x > width - 3 || y < 2 || y > height - 3) ||
      isObstacleAt(x, y)
    );
    
    if (attempts <= 100) {
      obstacles.push({ x, y });
      
      if (useWalls && i % 3 === 0 && i + 1 < obstacleCount) {
        const neighbors = [
          { x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 }
        ].filter(p => p.x > 1 && p.x < width - 2 && p.y > 1 && p.y < height - 2 && !isObstacleAt(p.x, p.y));
        
        if (neighbors.length > 0) {
          obstacles.push(neighbors[0]);
          i++;
        }
      }
    }
  }
  
  const start = { x: 1, y: 1 };
  const end = { x: width - 2, y: height - 2 };
  
  if (!isReachable(width, height, obstacles, start, end)) {
    if (obstacles.length > 0) {
      const removed = obstacles.pop();
      if (removed && !isReachable(width, height, obstacles, start, end)) {
        return [];
      }
    }
  }
  
  return obstacles;
}