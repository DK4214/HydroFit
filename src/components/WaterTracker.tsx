'use client';

import { useState } from 'react';
import { useWater } from '@/hooks/useWater';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplets, Plus, Minus } from 'lucide-react';

export function WaterTracker() {
  const { todayTotal, addWater, removeEntry, entries } = useWater();
  const { settings } = useSettings();
  const [customAmount, setCustomAmount] = useState(250);

  const progress = Math.min((todayTotal / settings.dailyGoal) * 100, 100);
  const remaining = Math.max(settings.dailyGoal - todayTotal, 0);

  const quickAmounts = [250, 500, 750, 1000];

  const handleAddWater = (amount: number) => {
    addWater(amount);
  };

  const todayEntries = entries.filter(entry => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return entry.timestamp >= today;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cyan-400 mb-2">Water Tracker</h1>
          <p className="text-gray-400">Acompanhe sua hidratação diária</p>
        </div>

        {/* Progress Card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-cyan-400">
              <Droplets className="w-5 h-5" />
              Progresso Diário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {todayTotal}{settings.unit}
              </div>
              <div className="text-gray-400">
                de {settings.dailyGoal}{settings.unit}
              </div>
            </div>

            <Progress value={progress} className="h-3" />

            <div className="text-center">
              {remaining > 0 ? (
                <p className="text-gray-400">
                  Faltam {remaining}{settings.unit} para hoje
                </p>
              ) : (
                <p className="text-green-400 font-semibold">
                  Meta atingida! 🎉
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Add Buttons */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-cyan-400">Adicionar Água</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => handleAddWater(amount)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {amount}{settings.unit}
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  min="1"
                  max="5000"
                />
                <span className="text-gray-400">{settings.unit}</span>
              </div>
              <Button
                onClick={() => handleAddWater(customAmount)}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Quantidade Personalizada
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Entries */}
        {todayEntries.length > 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-cyan-400">Entradas de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayEntries
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-2 bg-gray-800 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-cyan-400" />
                        <span>{entry.amount}{settings.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {entry.timestamp.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <Button
                          onClick={() => removeEntry(entry.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}