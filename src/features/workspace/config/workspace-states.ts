/**
 * Workspace States Configuration - декларативная конфигурация состояний
 * State machine routing для workspace
 */

import { CreateWorkspacePage } from '../pages/create-workspace-page';
import { SelectWorkspacePage } from '../pages/select-workspace-page';
import { WorkspaceDashboardPage } from '../pages/workspace-dashboard-page';
import { WorkspaceLoadingPage } from '../pages/workspace-loading-page';

export type WorkspaceStateKey = 'loading' | 'create' | 'select' | 'dashboard';

export interface WorkspaceStateConfig {
  component: React.ComponentType;
  title?: string;
  description?: string;
}

/**
 * Декларативная конфигурация состояний workspace
 */
export const workspaceStatesConfig: Record<WorkspaceStateKey, WorkspaceStateConfig> = {
  loading: {
    component: WorkspaceLoadingPage,
    title: 'Loading Workspace...',
    description: 'Please wait while we load your workspace',
  },

  create: {
    component: CreateWorkspacePage,
    title: 'Create Workspace',
    description: 'Create a new workspace to get started',
  },

  select: {
    component: SelectWorkspacePage,
    title: 'Select Workspace',
    description: 'Choose from your existing workspaces',
  },

  dashboard: {
    component: WorkspaceDashboardPage,
    title: 'Workspace Dashboard',
    description: 'Manage your workspace and projects',
  },
} as const;
