import { WorkspaceReportsPage } from '@/screens/workspace';
import { getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

type WorkspaceReportsParams = { id: string };

export const metadata: Metadata = getRouteMetadata('workspaceReports');

export default async function Page({ params }: { params: Promise<WorkspaceReportsParams> }) {
  const { id } = await params;

  return <WorkspaceReportsPage params={{ id }} />;
}
