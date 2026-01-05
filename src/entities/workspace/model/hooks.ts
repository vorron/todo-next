'use client';

import { useMemo } from 'react';

import { statefulRouteConfigData } from '@/shared/lib/router';
import { createEntityState } from '@/shared/lib/router/entity-utils';
import {
  createStatefulUtilsTyped,
  createUrlSyncUtils,
} from '@/shared/lib/router/stateful-generators';

import { useWorkspaceState } from './workspace-state';

import type { WorkspaceRouteStates, Workspace } from './types';

// Утилиты для workspace с улучшенной типизацией
const workspaceUtils = createStatefulUtilsTyped<WorkspaceRouteStates, keyof WorkspaceRouteStates>(
  statefulRouteConfigData.workspace,
  {
    stateRules: {
      loading: 'loading',
      empty: 'create',
      single: 'dashboard',
      multiple: 'select',
    },
    dataRules: {
      dashboard: (currentItem: unknown) => ({ workspaceId: (currentItem as Workspace)?.id }),
    },
  },
);

// Утилиты для URL синхронизации (отключены по умолчанию для client-side подхода)
// Можно включить через { enabled: true } при необходимости
const urlSyncUtils = createUrlSyncUtils(statefulRouteConfigData.workspace, {
  enabled: false, // Явный client-side подход
  syncOnLoad: false,
  syncOnChange: false,
});

export function useWorkspaceNavigation() {
  const { workspaces, currentWorkspace, isLoading } = useWorkspaceState();

  return useMemo(() => {
    const stateKey = workspaceUtils.getStateKey({
      isLoading,
      items: workspaces,
      currentItem: currentWorkspace,
    });

    const title = workspaceUtils.getStateTitle(stateKey, currentWorkspace);
    const breadcrumbs = workspaceUtils.getStateBreadcrumbs(stateKey, currentWorkspace);

    return { title, breadcrumbs };
  }, [workspaces, currentWorkspace, isLoading]);
}

export function useWorkspaceType(): keyof WorkspaceRouteStates {
  const { workspaces, isLoading } = useWorkspaceState();

  return useMemo(() => {
    return workspaceUtils.getStateKey({
      isLoading,
      items: workspaces,
      currentItem: null,
    });
  }, [workspaces, isLoading]);
}

export function useWorkspaceStateful(currentUrl?: string) {
  const { workspaces, currentWorkspace, isLoading } = useWorkspaceState();
  const workspaceConfig = statefulRouteConfigData.workspace;

  return useMemo(() => {
    let stateKey: keyof WorkspaceRouteStates;
    let data: WorkspaceRouteStates[keyof WorkspaceRouteStates];

    // Используем URL синхронизацию только если включена
    if (currentUrl && urlSyncUtils.isUrlSyncEnabled) {
      const urlState = urlSyncUtils.getStateFromUrl(currentUrl);
      if (urlState) {
        stateKey = urlState.state as keyof WorkspaceRouteStates;
        data = urlState.data as WorkspaceRouteStates[keyof WorkspaceRouteStates];
      } else {
        // Fallback к логике на основе данных
        stateKey = workspaceUtils.getStateKey({
          isLoading,
          items: workspaces,
          currentItem: currentWorkspace,
        });
        data = workspaceUtils.getStateData(stateKey, currentWorkspace);
      }
    } else {
      // Client-side подход - состояние на основе данных
      stateKey = workspaceUtils.getStateKey({
        isLoading,
        items: workspaces,
        currentItem: currentWorkspace,
      });
      data = workspaceUtils.getStateData(stateKey, currentWorkspace);
    }

    const state = createEntityState(stateKey, data);

    return {
      state,
      availableStates: Object.keys(workspaceConfig.states) as (keyof WorkspaceRouteStates)[],
      config: workspaceConfig,
      utils: workspaceUtils,
      urlSync: urlSyncUtils,
      workspaces,
      currentWorkspace,
      isLoading,
    };
  }, [workspaces, currentWorkspace, isLoading, currentUrl, workspaceConfig]);
}

/**
 * Создает навигацию для workspace с явными методами
 */
export function useWorkspaceNavigationActions() {
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceState();
  const { state } = useWorkspaceStateful();

  return useMemo(() => {
    const navigate = (
      _targetState: keyof WorkspaceRouteStates,
      _data?: WorkspaceRouteStates[keyof WorkspaceRouteStates],
    ) => {
      // Обновляем состояние на основе целевого состояния
      switch (_targetState) {
        case 'dashboard':
          if (_data && 'workspaceId' in _data) {
            const workspace = currentWorkspace;
            if (workspace?.id === _data.workspaceId) {
              // Уже в нужном workspace
              return;
            }
            // Здесь будет логика переключения workspace
          }
          break;
        case 'create':
          setCurrentWorkspace(null);
          break;
        case 'select':
          setCurrentWorkspace(null);
          break;
        case 'loading':
          // Перегрузка данных
          break;
      }
    };

    return {
      navigate,

      // Удобные методы
      navigateToCreate: () => navigate('create'),
      navigateToSelect: () => navigate('select'),
      navigateToDashboard: (workspaceId: string) => navigate('dashboard', { workspaceId }),
      navigateToLoading: () => navigate('loading'),

      // Текущее состояние
      currentState: state.key,
      canNavigateTo: (_targetState: keyof WorkspaceRouteStates) => {
        // Логика валидации переходов
        return true; // Пока разрешены все переходы
      },
    };
  }, [currentWorkspace, setCurrentWorkspace, state.key]);
}
