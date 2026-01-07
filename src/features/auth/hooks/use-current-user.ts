'use client';

import { useMemo } from 'react';

import { useAuth } from '../model/use-auth';

export function useCurrentUserId(): string {
  const { session } = useAuth();

  return useMemo(() => {
    // Временно возвращаем 'user-1' если нет сессии
    // TODO: Заменить на реальный ID из сессии когда auth будет реализован
    return session?.userId || 'user-1';
  }, [session]);
}
