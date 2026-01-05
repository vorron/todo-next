'use client';

import { WorkspaceStateRouter } from '@/features/workspace';

/**
 * Workspace Page Component - Screen layer
 * Отвечает за навигацию и координацию между feature layer
 */
export function WorkspacePage() {
  return <WorkspaceStateRouter />;
}
