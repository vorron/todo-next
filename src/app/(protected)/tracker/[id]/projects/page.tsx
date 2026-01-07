import { WorkspaceProjectsPage } from '@/screens/workspace-projects';
import { getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

type WorkspaceProjectsParams = { id: string };

export const metadata: Metadata = getRouteMetadata('workspaceProjects');

export default async function Page({ params }: { params: Promise<WorkspaceProjectsParams> }) {
  const { id } = await params;

  return <WorkspaceProjectsPage params={{ id }} />;
}
