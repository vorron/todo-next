'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import {
  useSession as useNextAuthSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from 'next-auth/react';

import { ROUTES } from '@/shared/lib/router';

import type { LoginDto } from './types';

type LoginResult = { success: true; message: string } | { success: false; message: string };

/**
 * 🎯 Эталонный useAuth хук с максимальным DX
 *
 * Объединяет лучшее из Redux и NextAuth.js:
 * - Знакомый API из старой системы
 * - Безопасность Auth.js под капотом
 * - Минимум бойлерплейта
 * - Полная типизация
 */
export function useAuth() {
  const { data: session, status, update } = useNextAuthSession();
  const router = useRouter();

  const login = useCallback(
    async (credentials: LoginDto): Promise<LoginResult> => {
      try {
        const result = await nextAuthSignIn('credentials', {
          username: credentials.username,
          password: credentials.password,
          redirect: false,
        });

        if (result?.error) {
          const message =
            result.error === 'CredentialsSignin'
              ? 'Неверные учетные данные'
              : 'Ошибка аутентификации';
          return { success: false, message };
        }

        if (result?.ok) {
          await update();
          return { success: true, message: 'Вход выполнен успешно' };
        }

        return { success: false, message: 'Неизвестная ошибка' };
      } catch {
        return { success: false, message: 'Ошибка сети' };
      }
    },
    [update],
  );

  const logout = useCallback(async () => {
    try {
      await nextAuthSignOut({ redirect: false });
    } finally {
      // Всегда редиректим даже при ошибке
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  const requireAuth = useCallback(() => {
    if (status === 'loading') return false;

    if (!session) {
      router.push(ROUTES.LOGIN);
      return false;
    }

    return true;
  }, [session, status, router]);

  return {
    // Данные пользователя
    user: session?.user,
    userId: session?.user?.id,

    // Состояние аутентификации
    isAuthenticated: !!session,
    isLoading: status === 'loading',

    // Действия
    login,
    logout,
    requireAuth,

    // NextAuth сессия для продвинутых кейсов
    session,
    update,
  };
}

/**
 * 🎯 Минималистичный хук для получения userId
 * Идеально для Server Components и простых кейсов
 */
export function useUserId() {
  const { userId, isLoading, isAuthenticated } = useAuth();
  return { userId, isLoading, isAuthenticated };
}

/**
 * 🎯 Хук сессии для продвинутых кейсов
 * Прямой доступ к NextAuth.js session
 */
export function useSession() {
  const { data: session, status, update } = useNextAuthSession();

  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    update,
  };
}
