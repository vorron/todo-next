import { getWorkspaceById } from '@/entities/workspace';
import { WorkspaceTimeEntryPage } from '@/screens/workspace-time-entry';
import { getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata('workspaceTimeEntry');

type WorkspaceTimeEntryParams = { id: string };

export default async function Page({ params }: { params: Promise<WorkspaceTimeEntryParams> }) {
  const { id } = await params;

  const workspace = await getWorkspaceById(id);

  return <WorkspaceTimeEntryPage workspace={workspace} />;
}
