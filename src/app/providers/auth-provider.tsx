'use client';

import { SessionProvider } from 'next-auth/react';

import type { Session } from 'next-auth';

interface AuthProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

/**
 * 🎯 Auth Provider с SessionProvider
 *
 * Предоставляет контекст сессии для NextAuth.js хуков
 * Опционально передает начальную сессию с сервера для оптимизации
 */
export function AuthProvider({ children, session }: AuthProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
