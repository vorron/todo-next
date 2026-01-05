'use client';

import { useMemo } from 'react';

import { ROUTES, statefulRouteConfigData } from '@/shared/lib/router';
import { createInitialEntityState } from '@/shared/lib/router/entity-utils';
import { getStateFromUrl } from '@/shared/lib/router/stateful-utils';

import { useWorkspaceState } from './workspace-state';

import type { WorkspaceRouteStates } from './types';

export function useWorkspaceNavigation() {
  const { workspaces, currentWorkspace, isLoading } = useWorkspaceState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const workspaceConfig = statefulRouteConfigData.workspace;

  return useMemo(() => {
    if (isLoading) {
      return {
        title: 'Loading...',
        breadcrumbs: [{ href: ROUTES.WORKSPACE, label: 'Workspace' }],
      };
    }

    if (workspaces.length === 0) {
      return {
        title: 'Create Workspace',
        breadcrumbs: [{ href: ROUTES.WORKSPACE, label: 'Workspace' }],
      };
    }

    if (workspaces.length === 1) {
      return {
        title: currentWorkspace?.name || 'Workspace',
        breadcrumbs: [{ href: ROUTES.WORKSPACE, label: 'Workspace' }],
      };
    }

    return {
      title: 'Select Workspace',
      breadcrumbs: [{ href: ROUTES.WORKSPACE, label: 'Workspace' }],
    };
  }, [workspaces, currentWorkspace, isLoading]);
}

export function useWorkspaceType() {
  const { workspaces, isLoading } = useWorkspaceState();

  if (isLoading) return 'loading' as const;
  if (workspaces.length === 0) return 'create' as const;
  if (workspaces.length === 1) return 'dashboard' as const;
  return 'select' as const;
}

/**
 * Новый хук для работы с stateful routing в workspace
 */
export function useWorkspaceStateful(currentUrl?: string) {
  const { workspaces, currentWorkspace, isLoading } = useWorkspaceState();
  const workspaceConfig = statefulRouteConfigData.workspace;

  return useMemo(() => {
    // Определяем состояние из URL или из данных
    let stateKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any;

    if (currentUrl && workspaceConfig.syncWithUrl) {
      const { state, data: urlData } = getStateFromUrl(workspaceConfig, currentUrl);
      stateKey = state as string;
      data = urlData;
    } else {
      // Fallback на логику基于 данных
      if (isLoading) {
        stateKey = 'loading';
      } else if (workspaces.length === 0) {
        stateKey = 'create';
      } else if (workspaces.length === 1) {
        stateKey = 'dashboard';
        data = { workspaceId: currentWorkspace?.id };
      } else {
        stateKey = 'select';
      }
    }

    const state = createInitialEntityState<WorkspaceRouteStates>(stateKey);
    state.key = stateKey;
    state.data = data;

    return {
      state,
      availableStates: Object.keys(workspaceConfig.states),
      config: workspaceConfig,
      workspaces,
      currentWorkspace,
      isLoading,
    };
  }, [workspaces, currentWorkspace, isLoading, currentUrl, workspaceConfig]);
}
