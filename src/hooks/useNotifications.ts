import { useEffect, useRef } from 'react';
import { UserSettings } from '@/types';

export function useNotifications(settings: UserSettings) {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (settings.remindersEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, [settings.remindersEnabled]);

  useEffect(() => {
    if (settings.remindersEnabled && settings.reminderInterval > 0) {
      intervalRef.current = setInterval(() => {
        if (Notification.permission === 'granted') {
          new Notification('Hora de beber água! 💧', {
            body: 'Mantenha-se hidratado!',
            icon: '/icon-192x192.png', // placeholder
          });
        }
      }, settings.reminderInterval * 60 * 60 * 1000); // hours to ms
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [settings.remindersEnabled, settings.reminderInterval]);

  return {};
}