export interface LeaderboardEntry {
  id: string;
  name: string;
  mode: 'test' | 'exam';
  score: number;
  total: number;
  percent: number;
  topics: string[];
  durationMs?: number;
  createdAt: number;
}

const KEY = 'mcq-leaderboard';

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'createdAt'>) {
  const entries = getLeaderboard();
  entries.push({ ...entry, id: crypto.randomUUID(), createdAt: Date.now() });
  entries.sort((a, b) => b.percent - a.percent || (a.durationMs ?? 0) - (b.durationMs ?? 0));
  localStorage.setItem(KEY, JSON.stringify(entries.slice(0, 100)));
}
