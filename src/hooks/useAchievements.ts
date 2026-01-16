import { useState, useEffect } from 'react';
import { Achievement } from '@/types';

const STORAGE_KEY = 'achievements';

const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_sip',
    title: 'Primeiro Gole',
    description: 'Beber água pela primeira vez',
    icon: 'Droplets',
    unlocked: false,
  },
  {
    id: 'goal_met',
    title: 'Meta Batida',
    description: 'Bater a meta diária',
    icon: 'Target',
    unlocked: false,
  },
  {
    id: '3_days',
    title: '3 Dias Hidratado',
    description: '3 dias seguidos cumprindo a meta',
    icon: 'Calendar',
    unlocked: false,
  },
  {
    id: '7_days',
    title: '7 Dias Hidratado',
    description: '7 dias seguidos cumprindo a meta',
    icon: 'Calendar',
    unlocked: false,
  },
  {
    id: '30_days',
    title: '30 Dias Hidratado',
    description: '30 dias seguidos cumprindo a meta',
    icon: 'Calendar',
    unlocked: false,
  },
  {
    id: '100_days',
    title: 'Hidratação Master',
    description: '100 dias consecutivos',
    icon: 'Crown',
    unlocked: false,
  },
];

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(ALL_ACHIEVEMENTS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAchievements(JSON.parse(stored));
    }
  }, []);

  const unlockAchievement = (id: string) => {
    setAchievements(prev =>
      prev.map(ach =>
        ach.id === id && !ach.unlocked
          ? { ...ach, unlocked: true, unlockedAt: Date.now() }
          : ach
      )
    );
    const updated = achievements.map(ach =>
      ach.id === id && !ach.unlocked
        ? { ...ach, unlocked: true, unlockedAt: Date.now() }
        : ach
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getUnlockedAchievements = () => achievements.filter(a => a.unlocked);

  return {
    achievements,
    unlockAchievement,
    getUnlockedAchievements,
  };
}