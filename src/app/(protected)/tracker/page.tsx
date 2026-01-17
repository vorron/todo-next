import { redirect } from 'next/navigation';

import { getUserWorkspaces, getDefaultWorkspace } from '@/entities/workspace';
import { requireAuth } from '@/features/auth';
import { TimeEntryPage } from '@/screens/workspace-time-entry';
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

  const defaultWorkspace = getDefaultWorkspace(workspaces);

  if (!defaultWorkspace) {
    redirect(ROUTES.TRACKER_ONBOARDING);
  }

  return <TimeEntryPage workspace={defaultWorkspace} workspaces={workspaces} />;
}
