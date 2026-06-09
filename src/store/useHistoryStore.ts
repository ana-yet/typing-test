import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TestRecord {
  id: string;
  date: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  mode: string;
  duration: number;
  mistakes: Record<string, number>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: number | null;
  icon: string;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_test', name: 'First Steps', description: 'Complete your first test', unlockedAt: null, icon: '🎯' },
  { id: '10_tests', name: 'Warming Up', description: 'Complete 10 tests', unlockedAt: null, icon: '🔥' },
  { id: '50_tests', name: 'Dedicated', description: 'Complete 50 tests', unlockedAt: null, icon: '📚' },
  { id: '100_tests', name: 'Centurion', description: 'Complete 100 tests', unlockedAt: null, icon: '💯' },
  { id: '50_wpm', name: 'Speedster', description: 'Reach 50 WPM', unlockedAt: null, icon: '🏃' },
  { id: '75_wpm', name: 'Lightning', description: 'Reach 75 WPM', unlockedAt: null, icon: '⚡' },
  { id: '100_wpm', name: 'Typing God', description: 'Reach 100 WPM', unlockedAt: null, icon: '🚀' },
  { id: 'accuracy_95', name: 'Precision', description: 'Achieve 95% accuracy on a test', unlockedAt: null, icon: '🎯' }
];

interface HistoryState {
  tests: TestRecord[];
  totalPracticeTime: number; // in seconds
  totalWordsTyped: number;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null; // YYYY-MM-DD
  achievements: Achievement[];
  mistakeHeatmap: Record<string, number>; // character -> total missed count

  addTestResult: (record: Omit<TestRecord, 'id'>) => void;
}

const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      tests: [],
      totalPracticeTime: 0,
      totalWordsTyped: 0,
      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastPracticeDate: null,
      achievements: INITIAL_ACHIEVEMENTS,
      mistakeHeatmap: {},

      addTestResult: (record) => {
        const state = get();
        const dateStr = new Date(record.date).toISOString().split('T')[0];
        
        let newStreak = state.currentStreak;
        let newLongest = state.longestStreak;
        
        if (state.lastPracticeDate) {
          const lastDate = new Date(state.lastPracticeDate);
          const today = new Date(dateStr);
          const diffTime = Math.abs(today.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newStreak += 1;
            if (newStreak > newLongest) newLongest = newStreak;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
          newLongest = 1;
        }

        // Calculate XP: base XP + speed bonus + accuracy bonus
        const baseXP = 10;
        const speedBonus = Math.floor(record.wpm / 2);
        const accBonus = record.accuracy >= 95 ? 20 : 0;
        const gainedXP = baseXP + speedBonus + accBonus;
        const newXP = state.xp + gainedXP;

        // Update heatmap
        const newHeatmap = { ...state.mistakeHeatmap };
        Object.entries(record.mistakes).forEach(([char, count]) => {
          newHeatmap[char] = (newHeatmap[char] || 0) + count;
        });

        // Achievements Logic
        const achievements = [...state.achievements];
        const unlock = (id: string) => {
          const ach = achievements.find(a => a.id === id);
          if (ach && !ach.unlockedAt) ach.unlockedAt = Date.now();
        };

        const totalTests = state.tests.length + 1;
        if (totalTests >= 1) unlock('first_test');
        if (totalTests >= 10) unlock('10_tests');
        if (totalTests >= 50) unlock('50_tests');
        if (totalTests >= 100) unlock('100_tests');
        if (record.wpm >= 50) unlock('50_wpm');
        if (record.wpm >= 75) unlock('75_wpm');
        if (record.wpm >= 100) unlock('100_wpm');
        if (record.accuracy >= 95) unlock('accuracy_95');

        set({
          tests: [{ ...record, id: Math.random().toString(36).substr(2, 9) }, ...state.tests].slice(0, 50), // keep last 50
          totalPracticeTime: state.totalPracticeTime + record.duration,
          totalWordsTyped: state.totalWordsTyped + Math.floor(record.wpm * (record.duration / 60)),
          xp: newXP,
          level: calculateLevel(newXP),
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastPracticeDate: dateStr,
          achievements,
          mistakeHeatmap: newHeatmap,
        });
      }
    }),
    {
      name: 'typemaster-history',
    }
  )
);
