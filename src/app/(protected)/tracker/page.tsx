import { redirect } from 'next/navigation';

import { getUserWorkspaces, findDefaultWorkspace } from '@/entities/workspace';
import { requireAuth } from '@/features/auth/lib/server/auth-server';
import { ROUTES } from '@/shared/lib/router';

/**
 * Tracker page - server-side редирект на default workspace
 * Использует Auth.js для получения userId из сессии
 */
export default async function TrackerPage() {
  const userId = await requireAuth();

  const workspaces = await getUserWorkspaces(userId);

  if (workspaces.length === 0) {
    redirect(ROUTES.TRACKER_ONBOARDING);
  }

  const defaultWorkspace = findDefaultWorkspace(workspaces);

  if (!defaultWorkspace) {
    redirect(ROUTES.TRACKER_ONBOARDING);
  }

  redirect(ROUTES.WORKSPACE_TIME_ENTRY(defaultWorkspace.id));
}
