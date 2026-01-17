import { WorkspaceSelectPage } from '@/screens/workspace';
import { getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata('workspaceSelect');

/**
 * Workspace Select Page
 * URL: /tracker/select
 */
export default function TrackerSelectPage() {
  return <WorkspaceSelectPage />;
}
