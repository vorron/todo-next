import { redirect } from 'next/navigation';

import { getUserWorkspaces, getDefaultWorkspace } from '@/entities/workspace';
import { getCurrentUserId } from '@/lib/auth-server';
import { WorkspaceTimeEntryPage } from '@/screens/workspace-time-entry';
import { ROUTES } from '@/shared/lib/router';

/**
 * Tracker page - server-side редирект на default workspace
 * Использует Auth.js для получения userId из сессии
 */
export default async function TrackerPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect(ROUTES.LOGIN);
  }

  const workspaces = await getUserWorkspaces(userId);

  if (workspaces.length === 0) {
    redirect(ROUTES.TRACKER_ONBOARDING);
  }

  const defaultWorkspace = getDefaultWorkspace(workspaces);
  if (!defaultWorkspace) {
    redirect(ROUTES.TRACKER_ONBOARDING);
  }

  return <WorkspaceTimeEntryPage workspace={defaultWorkspace} />;
}
