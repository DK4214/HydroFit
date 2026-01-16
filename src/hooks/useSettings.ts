import { useState, useEffect } from 'react';
import { UserSettings } from '@/types';

const STORAGE_KEY = 'user_settings';

const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 2000, // default 2L
  remindersEnabled: true,
  reminderInterval: 2, // 2 hours
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const calculateSuggestedGoal = (weight?: number) => {
    if (weight) {
      return weight * 35; // 35ml per kg is a common rule
    }
    return 2000; // default
  };

  return {
    settings,
    updateSettings,
    calculateSuggestedGoal,
  };
}