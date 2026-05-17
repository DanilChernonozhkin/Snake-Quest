import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StartScreen } from './StartScreen';

describe('StartScreen', () => {
  it('should render correctly', () => {
    const mockOnStart = vi.fn();
    render(<StartScreen onStart={mockOnStart} />);
    
    expect(screen.getByText('SNAKE')).toBeDefined();
    expect(screen.getByText('QUEST')).toBeDefined();
    expect(screen.getByPlaceholderText('YOUR NAME')).toBeDefined();
    expect(screen.getByText('НАЧАТЬ ИГРУ')).toBeDefined();
  });

  it('should show warning when name is empty', () => {
    const mockOnStart = vi.fn();
    render(<StartScreen onStart={mockOnStart} />);
    
    expect(screen.getByText(/Введите имя чтобы начать/)).toBeDefined();
  });

  it('should show success when name is entered', async () => {
    const mockOnStart = vi.fn();
    render(<StartScreen onStart={mockOnStart} />);
    
    const input = screen.getByPlaceholderText('YOUR NAME');
    await userEvent.type(input, 'TestPlayer');
    
    expect(screen.getByText(/Готов к приключениям/)).toBeDefined();
  });

  it('should call onStart when name is entered and button clicked', async () => {
    const mockOnStart = vi.fn();
    render(<StartScreen onStart={mockOnStart} />);
    
    const input = screen.getByPlaceholderText('YOUR NAME');
    await userEvent.type(input, 'TestPlayer');
    
    const button = screen.getByText('НАЧАТЬ ИГРУ');
    await userEvent.click(button);
    
    expect(mockOnStart).toHaveBeenCalledWith('TestPlayer');
  });

  it('should call onStart when Enter key pressed', async () => {
    const mockOnStart = vi.fn();
    render(<StartScreen onStart={mockOnStart} />);
    
    const input = screen.getByPlaceholderText('YOUR NAME');
    await userEvent.type(input, 'TestPlayer{enter}');
    
    expect(mockOnStart).toHaveBeenCalledWith('TestPlayer');
  });

  it('should not call onStart when button is disabled', async () => {
    const mockOnStart = vi.fn();
    render(<StartScreen onStart={mockOnStart} />);
    
    const button = screen.getByText('НАЧАТЬ ИГРУ');
    expect(button.hasAttribute('disabled')).toBe(true);
    
    await userEvent.click(button);
    expect(mockOnStart).not.toHaveBeenCalled();
  });
});