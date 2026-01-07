import { WorkspaceHubScreen } from '@/screens/workspace';
import { getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata('workspace');

/**
 * Workspace Hub Page
 * URL: /workspace
 * Overview всех workspace + smart actions
 */
export default function WorkspacePage() {
  return <WorkspaceHubScreen />;
}
