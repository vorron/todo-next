'use client';

import { useMemo } from 'react';

import { useAuth } from '../model/use-auth';

export function useCurrentUserId(): string {
  const { userId, isAuthenticated } = useAuth();

  return useMemo(() => {
    // Возвращаем userId только если пользователь авторизован
    if (!isAuthenticated || !userId) {
      throw new Error('User not authenticated');
    }
    return userId;
  }, [userId, isAuthenticated]);
}
