import { WorkspaceManageScreen } from '@/screens/workspace';
import { getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata('workspace.manage');

/**
 * Workspace Manage Page
 * URL: /workspace/manage
 * Полный список workspace для управления
 */
export default function WorkspaceManagePage() {
  return <WorkspaceManageScreen />;
}
