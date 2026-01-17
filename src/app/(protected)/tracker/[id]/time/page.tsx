import { redirect } from 'next/navigation';

import { getUserWorkspaces, getWorkspaceById } from '@/entities/workspace';
import { getCurrentUserId } from '@/features/auth/lib/server/auth-server';
import { TimeEntryPage } from '@/screens/workspace-time-entry';
import { ROUTES, getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

type WorkspaceTimeParams = { id: string };

export const metadata: Metadata = getRouteMetadata('workspaceTimeEntry');

export default async function Page({ params }: { params: Promise<WorkspaceTimeParams> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect(ROUTES.LOGIN);
  }

  const workspaces = await getUserWorkspaces(userId);

  if (workspaces.length === 0) {
    redirect(ROUTES.TRACKER_ONBOARDING);
  }

  const workspace = await getWorkspaceById(id);
  if (!workspace) {
    redirect(ROUTES.TRACKER_ONBOARDING);
  }

  return <TimeEntryPage workspace={workspace} workspaces={workspaces} />;
}
