'use client';

import { useWater } from '@/hooks/useWater';
import { useSettings } from '@/hooks/useSettings';
import { useAchievements } from '@/hooks/useAchievements';
import { useStreak } from '@/hooks/useStreak';
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Droplets, Flame, Settings, Trophy, Calendar } from 'lucide-react';

const motivationalMessages = [
  "Cada gole conta! 💧",
  "Mantenha-se hidratado e saudável!",
  "Água é vida! 🌊",
  "Seu corpo agradece! 🙏",
  "Continue assim, você está indo bem!",
  "Hidratação é fundamental!",
  "Beba água, viva melhor!",
  "Um gole de cada vez!",
];

export function WaterTracker() {
  const { todayAmount, addWater, removeWater } = useWater();
  const { settings } = useSettings();
  const { unlockAchievement, getUnlockedAchievements } = useAchievements();
  const { streak, updateStreak } = useStreak();
  const router = useRouter();

  useNotifications(settings);

  const [currentMessage, setCurrentMessage] = useState(motivationalMessages[0]);

  const remaining = Math.max(0, settings.dailyGoal - todayAmount);
  const progress = Math.min(100, (todayAmount / settings.dailyGoal) * 100);

  // Rotate motivational messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = motivationalMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % motivationalMessages.length;
        return motivationalMessages[nextIndex];
      });
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Check achievements and streak
  useEffect(() => {
    const unlocked = getUnlockedAchievements();

    // Unlock first sip
    if (todayAmount > 0 && !unlocked.find(a => a.id === 'first_sip')) {
      unlockAchievement('first_sip');
    }

    // Check if goal met
    if (todayAmount >= settings.dailyGoal && !unlocked.find(a => a.id === 'goal_met')) {
      unlockAchievement('goal_met');
      updateStreak(true);
    }

    // Check streak achievements
    const streakAchievements = [
      { id: '3_days', threshold: 3 },
      { id: '7_days', threshold: 7 },
      { id: '30_days', threshold: 30 },
      { id: '100_days', threshold: 100 },
    ];

    streakAchievements.forEach(({ id, threshold }) => {
      if (streak.current >= threshold && !unlocked.find(a => a.id === id)) {
        unlockAchievement(id);
      }
    });
  }, [todayAmount, settings.dailyGoal, unlockAchievement, updateStreak, getUnlockedAchievements, streak.current]);

  // Daily streak check - reset if goal not met by end of day
  useEffect(() => {
    const checkStreak = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const isEndOfDay = now.getHours() >= 23 && now.getMinutes() >= 55; // Check near end of day

      if (isEndOfDay && todayAmount < settings.dailyGoal) {
        updateStreak(false);
      }
    };

    const interval = setInterval(checkStreak, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [todayAmount, settings.dailyGoal, updateStreak]);

  const handleAddWater = (amount: number) => {
    addWater(amount);
  };

  const handleRemoveWater = (amount: number) => {
    removeWater(amount);
  };

  const unlockedCount = getUnlockedAchievements().length;

  return (
    <div className="flex flex-col min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-bold">HydroFit</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/achievements')}>
            <Trophy className="h-4 w-4" />
            <Badge variant="secondary" className="ml-1">{unlockedCount}</Badge>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/settings')}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="flex-1">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg">Hidratação Diária</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Streak */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-orange-500">
              <Flame className="h-5 w-5" />
              <span className="font-semibold">Ofensiva: {streak.current} dias</span>
            </div>
            {streak.current > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Você está há {streak.current} dias hidratado 💧
              </p>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{todayAmount} ml consumidos</span>
              <span>{remaining} ml restantes</span>
            </div>
            <Progress value={progress} className="h-4" />
            <p className="text-center text-sm text-muted-foreground">
              Meta: {settings.dailyGoal} ml
            </p>
          </div>

          {/* Add Water Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => handleAddWater(200)}
                variant="outline"
                size="lg"
                className="h-16 text-lg font-semibold"
              >
                +200 ml
              </Button>
              <Button
                onClick={() => handleAddWater(300)}
                variant="outline"
                size="lg"
                className="h-16 text-lg font-semibold"
              >
                +300 ml
              </Button>
              <Button
                onClick={() => handleAddWater(500)}
                variant="outline"
                size="lg"
                className="h-16 text-lg font-semibold"
              >
                +500 ml
              </Button>
            </div>

            {/* Remove Water Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => handleRemoveWater(200)}
                variant="outline"
                size="lg"
                className="h-16 text-lg font-semibold border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                -200 ml
              </Button>
              <Button
                onClick={() => handleRemoveWater(300)}
                variant="outline"
                size="lg"
                className="h-16 text-lg font-semibold border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                -300 ml
              </Button>
              <Button
                onClick={() => handleRemoveWater(500)}
                variant="outline"
                size="lg"
                className="h-16 text-lg font-semibold border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                -500 ml
              </Button>
            </div>
          </div>

          {/* Goal celebration */}
          {progress >= 100 && (
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Trophy className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="font-semibold text-green-800 dark:text-green-200">Meta atingida! 🎉</p>
              <p className="text-sm text-green-600 dark:text-green-400">Continue assim amanhã!</p>
            </div>
          )}

          {/* Motivational message */}
          {progress < 100 && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground italic">
                {streak.current > 0 ? 'Não quebre sua ofensiva hoje!' : currentMessage}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}