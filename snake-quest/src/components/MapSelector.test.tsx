import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapSelector } from './MapSelector';
import { maps } from '../data/maps';

describe('MapSelector', () => {
  it('должен отображать все карты', () => {
    const mockOnSelectMap = vi.fn();
    const mockOnBackToMenu = vi.fn();
    
    render(<MapSelector onSelectMap={mockOnSelectMap} onBackToMenu={mockOnBackToMenu} />);
    
    expect(screen.getByText('Классическая')).toBeInTheDocument();
    expect(screen.getByText('Лабиринт')).toBeInTheDocument();
    expect(screen.getByText('Открытое поле')).toBeInTheDocument();
    expect(screen.getByText('Зигзаг')).toBeInTheDocument();
    expect(screen.getByText('Случайная генерация')).toBeInTheDocument();
  });
  
  it('должен вызывать onSelectMap при клике на карту', () => {
    const mockOnSelectMap = vi.fn();
    const mockOnBackToMenu = vi.fn();
    
    render(<MapSelector onSelectMap={mockOnSelectMap} onBackToMenu={mockOnBackToMenu} />);
    
    fireEvent.click(screen.getByText('Классическая'));
    expect(mockOnSelectMap).toHaveBeenCalled();
  });
});