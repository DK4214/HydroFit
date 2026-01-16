'use client';

import { useState, useEffect } from 'react';

export interface Settings {
  onboardingCompleted: boolean;
  dailyGoal: number;
  unit: 'ml' | 'oz';
}

const defaultSettings: Settings = {
  onboardingCompleted: false,
  dailyGoal: 2000,
  unit: 'ml',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carrega settings do localStorage
    const savedSettings = localStorage.getItem('water-tracker-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('water-tracker-settings', JSON.stringify(updated));
  };

  return {
    settings,
    isLoading,
    updateSettings,
  };
}