import { useEffect, useState } from 'react';
import { toast } from '@/shared/ui';

/**
 * Hook для отслеживания статуса сети
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored', {
        description: 'You are back online',
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Connection lost', {
        description: 'Please check your internet connection',
        duration: Infinity, // Не закрывать автоматически
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
