import React, { useEffect, useRef } from 'react';
import type { Position } from '../types/game.types';
import './GameCanvas.css';

interface Props {
  width: number;
  height: number;
  snake: Position[];
  food: Position;
  obstacles: Position[];
  cellSize: number;
}

export const GameCanvas: React.FC<Props> = ({ width, height, snake, food, obstacles, cellSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width * cellSize;
    canvas.height = height * cellSize;

    // Background
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#1a1f3e';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= width; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Obstacles
    ctx.fillStyle = '#4a3b7c';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#4a3b7c';
    obstacles.forEach(obs => {
      ctx.fillRect(obs.x * cellSize, obs.y * cellSize, cellSize - 1, cellSize - 1);
    });

    // Food
    ctx.fillStyle = '#ff3e6c';
    ctx.shadowColor = '#ff3e6c';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize - 1, cellSize - 1);

    // Snake
    ctx.fillStyle = '#25ff6e';
    ctx.shadowColor = '#25ff6e';
    snake.forEach(seg => {
      ctx.fillRect(seg.x * cellSize, seg.y * cellSize, cellSize - 1, cellSize - 1);
    });

    // Snake head (brighter)
    if (snake[0]) {
      ctx.fillStyle = '#2b5d3c';
      ctx.fillRect(snake[0].x * cellSize, snake[0].y * cellSize, cellSize - 1, cellSize - 1);
    }

    ctx.shadowBlur = 0;
  }, [snake, food, obstacles, width, height, cellSize]);

  return <canvas ref={canvasRef} className="game-canvas" />;
};