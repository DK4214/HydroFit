export interface UserSettings {
  name?: string;
  weight?: number;
  dailyGoal: number; // in ml
  remindersEnabled: boolean;
  reminderInterval: number; // in hours
}

export interface WaterEntry {
  date: string; // YYYY-MM-DD
  amount: number; // in ml
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface StreakData {
  current: number;
  lastCompletedDate?: string; // YYYY-MM-DD
}