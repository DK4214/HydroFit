import { useState, useEffect } from 'react';
import { StreakData } from '@/types';

const STORAGE_KEY = 'streak_data';

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>({ current: 0 });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setStreak(JSON.parse(stored));
    }
  }, []);

  const updateStreak = (goalMet: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    let newStreak = { ...streak };

    if (goalMet) {
      if (streak.lastCompletedDate === getYesterday()) {
        newStreak.current += 1;
      } else if (streak.lastCompletedDate !== today) {
        newStreak.current = 1;
      }
      newStreak.lastCompletedDate = today;
    } else {
      if (streak.lastCompletedDate !== today) {
        newStreak.current = 0;
      }
    }

    setStreak(newStreak);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStreak));
  };

  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  return {
    streak,
    updateStreak,
  };
}