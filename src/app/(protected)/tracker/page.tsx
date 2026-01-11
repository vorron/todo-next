import { redirect } from 'next/navigation';

import { getUserWorkspaces, getDefaultWorkspace } from '@/entities/workspace/lib/server-workspace';
import { getCurrentUserId } from '@/lib/auth-server';

/**
 * Tracker page - server-side редирект на default workspace
 * Использует Auth.js для получения userId из сессии
 */
export default async function TrackerPage() {
  // Получаем userId из сессии через Auth.js
  const userId = await getCurrentUserId();

  // Если пользователь не авторизован - редирект на логин
  if (!userId) {
    redirect('/login');
  }

  try {
    const workspaces = await getUserWorkspaces(userId);

    if (workspaces.length === 0) {
      redirect('/tracker/onboarding');
    }

    const defaultWorkspace = getDefaultWorkspace(workspaces);
    if (!defaultWorkspace) {
      redirect('/tracker/onboarding');
    }

    redirect(`/tracker/${defaultWorkspace.id}/time-entry`);
  } catch (error) {
    // NEXT_REDIRECT - ожидаемое поведение Next.js
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    console.error('Tracker redirect error:', error);
    redirect('/tracker/onboarding');
  }
}
