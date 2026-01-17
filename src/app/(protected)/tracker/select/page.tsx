import { WorkspaceSelectContent } from '@/features/workspace/content/workspace-select-content';
import { getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata('workspaceSelect');

/**
 * Workspace Select Page
 * URL: /tracker/select
 */
export default function TrackerSelectPage() {
  return <WorkspaceSelectContent />;
}
