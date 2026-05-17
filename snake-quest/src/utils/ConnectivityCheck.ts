import type { Position } from '../types/game.types';

export function isReachable(
  width: number,
  height: number,
  obstacles: Position[],
  start: Position,
  end: Position
): boolean {
  const grid: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(true));
  
  obstacles.forEach(obs => {
    if (obs.x >= 0 && obs.x < width && obs.y >= 0 && obs.y < height) {
      grid[obs.y][obs.x] = false;
    }
  });
  
  const queue: Position[] = [start];
  const visited: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));
  visited[start.y][start.x] = true;
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.x === end.x && current.y === end.y) return true;
    
    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];
    
    for (const neighbor of neighbors) {
      if (neighbor.x >= 0 && neighbor.x < width && neighbor.y >= 0 && neighbor.y < height) {
        if (grid[neighbor.y][neighbor.x] && !visited[neighbor.y][neighbor.x]) {
          visited[neighbor.y][neighbor.x] = true;
          queue.push(neighbor);
        }
      }
    }
  }
  
  return false;
}