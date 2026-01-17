/**
 * Workspace Router UI
 * Декларативный роутер по паттерну todos
 */

import { TimeEntryPage, WorkspaceDashboardPage } from '@/features/workspace/pages';

import type { WorkspaceViewState } from '../model/use-workspace-state';

export interface WorkspaceRouterProps {
  workspaceState: WorkspaceViewState;
}

/**
 * Декларативный роутер workspace
 * Следует паттерну todos с минимальным boilerplate
 */
export function WorkspaceRouter({ workspaceState }: WorkspaceRouterProps) {
  const { viewMode, currentWorkspace } = workspaceState;

  // Декларативный рендеринг на основе viewMode
  switch (viewMode) {
    case 'time-entry':
      if (!currentWorkspace) return <div>No workspace selected</div>;
      return <TimeEntryPage workspace={currentWorkspace} workspaces={workspaceState.workspaces} />;

    case 'dashboard':
      if (!currentWorkspace) return <div>No workspace selected</div>;
      return <WorkspaceDashboardPage workspace={currentWorkspace} />;

    case 'select':
      return <div>Select workspace functionality coming soon</div>;

    default:
      return <div>Unknown workspace view</div>;
  }
}
