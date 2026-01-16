'use client';

import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { settings, updateSettings, calculateSuggestedGoal } = useSettings();
  const [name, setName] = useState(settings.name || '');
  const [weight, setWeight] = useState(settings.weight?.toString() || '');
  const [dailyGoal, setDailyGoal] = useState(settings.dailyGoal.toString());
  const [remindersEnabled, setRemindersEnabled] = useState(settings.remindersEnabled);
  const [reminderInterval, setReminderInterval] = useState(settings.reminderInterval.toString());
  const router = useRouter();

  const handleSave = () => {
    const weightNum = weight ? parseFloat(weight) : undefined;
    const goalNum = parseFloat(dailyGoal);
    const intervalNum = parseFloat(reminderInterval);

    updateSettings({
      name: name || undefined,
      weight: weightNum,
      dailyGoal: goalNum,
      remindersEnabled,
      reminderInterval: intervalNum,
    });

    router.push('/');
  };

  const handleWeightChange = (value: string) => {
    setWeight(value);
    if (value) {
      const suggested = calculateSuggestedGoal(parseFloat(value));
      setDailyGoal(suggested.toString());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome (opcional)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso corporal (kg) (opcional)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => handleWeightChange(e.target.value)}
              placeholder="Ex: 70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Meta diária (ml)</Label>
            <Input
              id="goal"
              type="number"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              placeholder="2000"
            />
            <p className="text-sm text-muted-foreground">
              Sugestão baseada no peso: {weight ? calculateSuggestedGoal(parseFloat(weight)) : 2000} ml
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reminders">Lembretes ativados</Label>
            <Switch
              id="reminders"
              checked={remindersEnabled}
              onCheckedChange={setRemindersEnabled}
            />
          </div>

          {remindersEnabled && (
            <div className="space-y-2">
              <Label htmlFor="interval">Intervalo dos lembretes (horas)</Label>
              <Select value={reminderInterval} onValueChange={setReminderInterval}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">A cada 1 hora</SelectItem>
                  <SelectItem value="2">A cada 2 horas</SelectItem>
                  <SelectItem value="3">A cada 3 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={handleSave} className="w-full">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}