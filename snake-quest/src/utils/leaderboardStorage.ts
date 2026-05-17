import type { LeaderboardEntry } from '../types/game.types';

const STORAGE_KEY = 'snakeQuestLeaderboard';

/**
 * Сохраняет запись в таблицу лидеров.
 * Если запись с таким же игроком, картой и сложностью существует,
 * обновляет её только если новый счет выше.
 * 
 * @param entry - Запись для сохранения
 * 
 * @example
 * ```tsx
 * saveLeaderboardEntry({
 *   id: Date.now().toString(),
 *   playerName: 'Player',
 *   score: 100,
 *   mapName: 'Classic',
 *   difficulty: 'Easy',
 *   date: new Date().toISOString()
 * });
 * ```
 */
export function saveLeaderboardEntry(entry: LeaderboardEntry): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let entries: LeaderboardEntry[] = saved ? JSON.parse(saved) : [];
    
    const existingIndex = entries.findIndex((e: LeaderboardEntry) => 
      e.playerName === entry.playerName && 
      e.mapName === entry.mapName && 
      e.difficulty === entry.difficulty
    );
    
    if (existingIndex !== -1) {
      if (entries[existingIndex].score < entry.score) {
        entries[existingIndex] = entry;
      }
    } else {
      entries.push(entry);
    }
    
    entries.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);
    entries = entries.slice(0, 10);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save leaderboard entry:', error);
  }
}

/**
 * Загружает все записи из таблицы лидеров.
 * 
 * @returns Массив записей таблицы лидеров
 * 
 * @example
 * ```tsx
 * const entries = loadLeaderboardEntries();
 * console.log(entries[0].score);
 * ```
 */
export function loadLeaderboardEntries(): LeaderboardEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load leaderboard entries:', error);
    return [];
  }
}

/**
 * Очищает таблицу лидеров.
 * 
 * @example
 * ```tsx
 * clearLeaderboard();
 * ```
 */
export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear leaderboard:', error);
  }
}