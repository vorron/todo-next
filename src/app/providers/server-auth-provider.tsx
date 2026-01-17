import { auth } from '@/features/auth/lib/auth';

import { AuthProvider } from './auth-provider';

/**
 * 🎯 Server-side Auth Provider
 *
 * Получает сессию на сервере и передает в AuthProvider
 * Это оптимизирует загрузку - не нужно делать лишний запрос на клиенте
 */
export async function ServerAuthProvider({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return <AuthProvider session={session}>{children}</AuthProvider>;
}
