import { WorkspaceProjectsPage } from '@/screens/workspace';
import { getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

type TrackerProjectsParams = { id: string };

export const metadata: Metadata = getRouteMetadata('workspaceProjects');

export default async function Page({ params }: { params: Promise<TrackerProjectsParams> }) {
  const { id } = await params;

  return <WorkspaceProjectsPage params={{ id }} />;
}
