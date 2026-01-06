/**
 * Workspace Components Configuration
 * Карта компонентов workspace с динамической загрузкой
 */

import { lazy } from 'react';

export const workspaceComponents = {
  create: lazy(() =>
    import('../pages/create-workspace-page').then(({ CreateWorkspacePage }) => ({
      default: CreateWorkspacePage,
    })),
  ),
  select: lazy(() =>
    import('../pages/select-workspace-page').then(({ SelectWorkspacePage }) => ({
      default: SelectWorkspacePage,
    })),
  ),
  dashboard: lazy(() =>
    import('../pages/workspace-dashboard-page').then(({ WorkspaceDashboardPage }) => ({
      default: WorkspaceDashboardPage,
    })),
  ),
} as const;

export type WorkspaceStateKey = keyof typeof workspaceComponents;
