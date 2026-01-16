'use client';

import { useState, useEffect } from 'react';

export interface WaterEntry {
  id: string;
  amount: number;
  timestamp: Date;
}

export function useWater() {
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);

  useEffect(() => {
    // Carrega entradas do localStorage
    const savedEntries = localStorage.getItem('water-tracker-entries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        setEntries(parsed);
        updateTodayTotal(parsed);
      } catch (error) {
        console.error('Erro ao carregar entradas:', error);
      }
    }
  }, []);

  const updateTodayTotal = (entriesList: WaterEntry[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEntries = entriesList.filter(entry => entry.timestamp >= today);
    const total = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
    setTodayTotal(total);
  };

  const addWater = (amount: number) => {
    const newEntry: WaterEntry = {
      id: Date.now().toString(),
      amount,
      timestamp: new Date(),
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    updateTodayTotal(updatedEntries);
    localStorage.setItem('water-tracker-entries', JSON.stringify(updatedEntries));
  };

  const removeEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    updateTodayTotal(updatedEntries);
    localStorage.setItem('water-tracker-entries', JSON.stringify(updatedEntries));
  };

  return {
    entries,
    todayTotal,
    addWater,
    removeEntry,
  };
}