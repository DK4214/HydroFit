import { useState, useEffect } from 'react';
import { WaterEntry } from '@/types';

const STORAGE_KEY = 'water_entries';

export function useWater() {
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [todayAmount, setTodayAmount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allEntries = JSON.parse(stored) as WaterEntry[];
      setEntries(allEntries);
      const today = new Date().toISOString().split('T')[0];
      const todayEntries = allEntries.filter(entry => entry.date === today);
      const total = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
      setTodayAmount(total);
    }
  }, []);

  const addWater = (amount: number) => {
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];
    const newEntry: WaterEntry = {
      date: today,
      amount,
      timestamp: now,
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    setTodayAmount(prev => prev + amount);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  };

  const removeWater = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = entries.filter(entry => entry.date === today);
    let remainingToRemove = amount;
    const updatedEntries = [...entries];

    // Remove from the most recent entries first
    for (let i = todayEntries.length - 1; i >= 0 && remainingToRemove > 0; i--) {
      const entry = todayEntries[i];
      const entryIndex = updatedEntries.findIndex(e => e.timestamp === entry.timestamp);
      if (remainingToRemove >= entry.amount) {
        updatedEntries.splice(entryIndex, 1);
        remainingToRemove -= entry.amount;
      } else {
        updatedEntries[entryIndex] = { ...entry, amount: entry.amount - remainingToRemove };
        remainingToRemove = 0;
      }
    }

    const newTodayAmount = Math.max(0, todayAmount - amount);
    setEntries(updatedEntries);
    setTodayAmount(newTodayAmount);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  };

  const getTodayEntries = () => {
    const today = new Date().toISOString().split('T')[0];
    return entries.filter(entry => entry.date === today);
  };

  return {
    todayAmount,
    addWater,
    removeWater,
    getTodayEntries,
  };
}