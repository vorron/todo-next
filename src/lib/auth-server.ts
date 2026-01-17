import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/lib/router';

/**
 * 🎯 Server-side auth utilities - 4 функции для 99% кейсов
 */

/**
 * Получить userId текущего пользователя
 *
 * @example
 * ```tsx
 * export default async function ProfilePage() {
 *   const userId = await getCurrentUserId();
 *   if (!userId) redirect(ROUTES.LOGIN);
 *
 *   const profile = await getProfile(userId);
 *   return <Profile profile={profile} />;
 * }
 * ```
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id || null;
}

/**
 * Получить полную сессию пользователя
 *
 * @example
 * ```tsx
 * export default async function Dashboard() {
 *   const session = await getSession();
 *   if (!session) redirect(ROUTES.LOGIN);
 *
 *   return <h1>Welcome, {session.user.name}!</h1>;
 * }
 * ```
 */
export async function getSession() {
  return await auth();
}

/**
 * Проверить авторизацию (с редиректом)
 *
 * @example
 * ```tsx
 * export default async function ProtectedPage() {
 *   const userId = await requireAuth();
 *   // Пользователь точно авторизован
 *   return <ProtectedContent userId={userId} />;
 * }
 * ```
 */
export async function requireAuth(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect(ROUTES.LOGIN);
  }
  return userId;
}

/**
 * Проверить авторизацию (с исключением)
 * Для Server Actions где редирект не нужен
 *
 * @example
 * ```tsx
 * 'use server';
 * export async function protectedAction() {
 *   const userId = await verifyAuth();
 *   // Логика с userId
 * }
 * ```
 */
export async function verifyAuth(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
}
