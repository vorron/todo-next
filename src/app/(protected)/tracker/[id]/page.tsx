import { WorkspaceDashboardPage } from '@/screens/workspace-dashboard';
import { getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

type WorkspaceParams = { id: string };

export const metadata: Metadata = getRouteMetadata('workspaceDashboard');

export default async function Page({ params }: { params: Promise<WorkspaceParams> }) {
  const { id } = await params;

  return <WorkspaceDashboardPage params={{ id }} />;
}
