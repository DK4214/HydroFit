'use client';

import { useAchievements } from '@/hooks/useAchievements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Lock } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function AchievementsPage() {
  const { achievements } = useAchievements();
  const router = useRouter();

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-8 w-8" /> : <Trophy className="h-8 w-8" />;
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Conquistas</h1>
      </div>

      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={`transition-all ${achievement.unlocked ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'opacity-60'}`}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                {achievement.unlocked ? getIcon(achievement.icon) : <Lock className="h-8 w-8" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{achievement.title}</h3>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                      Desbloqueada
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {achievements.filter(a => a.unlocked).length === 0 && (
        <div className="text-center mt-8">
          <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma conquista desbloqueada ainda.</p>
          <p className="text-sm text-muted-foreground mt-2">Comece bebendo água para ganhar suas primeiras conquistas!</p>
        </div>
      )}
    </div>
  );
}