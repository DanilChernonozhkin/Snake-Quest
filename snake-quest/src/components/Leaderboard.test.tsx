import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Leaderboard } from './Leaderboard';

describe('Leaderboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show empty state when no entries', () => {
    render(<Leaderboard onClose={() => {}} />);
    
    expect(screen.getByText('Нет сохраненных результатов')).toBeDefined();
  });

  it('should load and display saved entries', () => {
    const testEntries = [
      { id: '1', playerName: 'Player1', score: 100, mapName: 'Classic', difficulty: 'Easy', date: new Date().toISOString() }
    ];
    localStorage.setItem('snakeQuestLeaderboard', JSON.stringify(testEntries));
    
    render(<Leaderboard onClose={() => {}} />);
    
    expect(screen.getByText('Player1')).toBeDefined();
    expect(screen.getByText('100')).toBeDefined();
  });
  
  it('should call onClose when clicking close button', () => {
    const mockOnClose = vi.fn();
    render(<Leaderboard onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('✕'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});