// src/utils/gameLogic.ts
import { Position, Direction, MapConfig } from '../Types';

export const DIRECTION_VECTORS: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT'
};

export function isValidDirection(current: Direction, next: Direction): boolean {
  return OPPOSITE_DIRECTIONS[current] !== next;
}

export function generateRandomFood(
  snake: Position[],
  walls: Position[],
  width: number,
  height: number
): Position {
  const maxAttempts = 1000;
  for (let i = 0; i < maxAttempts; i++) {
    const food = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
    
    const isOnSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
    const isOnWall = walls.some(wall => wall.x === food.x && wall.y === food.y);
    
    if (!isOnSnake && !isOnWall) {
      return food;
    }
  }
  
  // Fallback: find first empty cell
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isOnSnake = snake.some(segment => segment.x === x && segment.y === y);
      const isOnWall = walls.some(wall => wall.x === x && wall.y === y);
      if (!isOnSnake && !isOnWall) {
        return { x, y };
      }
    }
  }
  
  return { x: 0, y: 0 };
}

export function checkCollision(
  head: Position,
  snake: Position[],
  walls: Position[],
  width: number,
  height: number
): boolean {
  // Check wall collision
  if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
    return true;
  }
  
  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return true;
  }
  
  // Check wall collision
  if (walls.some(wall => wall.x === head.x && wall.y === head.y)) {
    return true;
  }
  
  return false;
}

export function getValidStartPosition(map: MapConfig): Position {
  const center = { x: Math.floor(map.width / 2), y: Math.floor(map.height / 2) };
  
  // Check if center is valid
  const isCenterValid = !map.walls.some(w => w.x === center.x && w.y === center.y);
  
  if (isCenterValid) {
    return center;
  }
  
  // Find nearest valid position
  for (let radius = 1; radius < Math.max(map.width, map.height); radius++) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const pos = { x: center.x + dx, y: center.y + dy };
        if (pos.x >= 1 && pos.x < map.width - 1 && pos.y >= 1 && pos.y < map.height - 1) {
          const isValid = !map.walls.some(w => w.x === pos.x && w.y === pos.y);
          if (isValid) {
            return pos;
          }
        }
      }
    }
  }
  
  return { x: 1, y: 1 };
}

export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function validateMapConnectivity(map: MapConfig, startPos: Position): boolean {
  const visited: boolean[][] = Array(map.height).fill(null).map(() => Array(map.width).fill(false));
  const queue: Position[] = [startPos];
  visited[startPos.y][startPos.x] = true;
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 }
    ];
    
    for (const neighbor of neighbors) {
      if (neighbor.x >= 0 && neighbor.x < map.width && neighbor.y >= 0 && neighbor.y < map.height) {
        const isWall = map.walls.some(w => w.x === neighbor.x && w.y === neighbor.y);
        if (!isWall && !visited[neighbor.y][neighbor.x]) {
          visited[neighbor.y][neighbor.x] = true;
          queue.push(neighbor);
        }
      }
    }
  }
  
  // Check if all non-wall cells are visited
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const isWall = map.walls.some(w => w.x === x && w.y === y);
      if (!isWall && !visited[y][x]) {
        return false;
      }
    }
  }
  
  return true;
}