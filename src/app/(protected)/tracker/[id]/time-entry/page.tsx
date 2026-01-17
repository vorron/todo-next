import { redirect } from 'next/navigation';

import { getUserWorkspaces, getWorkspaceById } from '@/entities/workspace';
import { getCurrentUserId } from '@/features/auth/lib/server/auth-server';
import { TimeEntryPage } from '@/screens/workspace';
import { getRouteMetadata, ROUTES } from '@/shared/lib/router';

import type { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata('workspaceTimeEntry');

type TimeEntryParams = { id: string };

export default async function Page({ params }: { params: Promise<TimeEntryParams> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect(ROUTES.LOGIN);
  }

  const [workspace, allWorkspaces] = await Promise.all([
    getWorkspaceById(id),
    getUserWorkspaces(userId),
  ]);

  if (!workspace) {
    redirect(ROUTES.TRACKER_ONBOARDING);
  }

  return <TimeEntryPage workspace={workspace} workspaces={allWorkspaces} />;
}
