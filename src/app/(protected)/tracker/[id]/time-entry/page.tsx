import { WorkspaceTimeEntryPage } from '@/screens/workspace-time-entry';
import { getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

type WorkspaceTimeEntryParams = { id: string };

export const metadata: Metadata = getRouteMetadata('workspaceTimeEntry');

export default async function Page({ params }: { params: Promise<WorkspaceTimeEntryParams> }) {
  const { id } = await params;

  return <WorkspaceTimeEntryPage params={{ id }} />;
}
