'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/useSettings';
import { WaterTracker } from '@/components/WaterTracker';

export default function Home() {
  const { settings } = useSettings();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Aguarda settings carregar
    const timer = setTimeout(() => {
      setIsChecking(false);
      
      // Redireciona apenas se onboarding não foi completado
      if (settings.onboardingCompleted === false) {
        // Usa replace em vez de push para evitar problemas de navegação
        router.replace('/onboarding');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [settings.onboardingCompleted, router]);

  // Mostra loading enquanto verifica onboarding
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Carregando...</div>
      </div>
    );
  }

  // Se onboarding não completado, não renderiza nada (vai redirecionar)
  if (settings.onboardingCompleted === false) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Redirecionando...</div>
      </div>
    );
  }

  return <WaterTracker />;
}
