/**
 * Workspace State Hook
 * Улучшенный state management по паттерну todos
 */

import { useMemo } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useCreateWorkspace } from '@/features/workspace/model/mutations';
import { useWorkspaces } from '@/features/workspace/model/queries';
// import { ROUTES } from '@/shared/config/router-config'; // Не используется

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceViewState {
  // Data
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  isCreating: boolean;
  error: unknown;

  // URL state
  workspaceId: string | null;
  viewMode: 'dashboard' | 'time-entry' | 'create' | 'select';

  // Actions
  actions: {
    // Navigation
    goToDashboard: (id: string) => void;
    goToTimeEntry: (id: string) => void;
    goToCreate: () => void;
    goToSelect: () => void;

    // Workspace management
    setCurrentWorkspace: (id: string) => void;
    createWorkspace: (
      data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt' | 'isDefault'>,
    ) => Promise<Workspace>;
  };

  // Computed
  hasWorkspaces: boolean;
  workspacesCount: number;
  isDefaultWorkspace: boolean;
}

/**
 * Основной хук workspace состояния
 * Следует паттерну todos с улучшенной декларативностью
 */
export function useWorkspaceState(): WorkspaceViewState {
  const router = useRouter();
  const params = useParams();

  // Data fetching
  const { workspaces, isLoading, error } = useWorkspaces();
  const { createWorkspace, isCreating } = useCreateWorkspace();

  // URL state extraction
  const workspaceId = (params.id as string) || null;
  const viewMode = getViewModeFromParams(params);

  // Current workspace logic
  const currentWorkspace = useMemo(() => {
    if (!workspaceId) return null;
    return workspaces.find((w) => w.id === workspaceId) || null;
  }, [workspaces, workspaceId]);

  // Default workspace logic (не используется в текущей реализации)
  // const defaultWorkspace = useMemo(() => {
  //   return workspaces.find((w) => w.isDefault) || workspaces[0] || null;
  // }, [workspaces]);

  // Actions with URL synchronization
  const actions = useMemo(
    () => ({
      // Navigation actions
      goToDashboard: (id: string) => {
        router.push(`/workspace/${id}`);
      },
      goToTimeEntry: (id: string) => {
        router.push(`/workspace/${id}/time`);
      },
      goToCreate: () => {
        router.push('/workspace/create');
      },
      goToSelect: () => {
        router.push('/workspace/select');
      },

      // Workspace management
      setCurrentWorkspace: (id: string) => {
        router.push(`/workspace/${id}/time`);
      },
      createWorkspace,
    }),
    [router, createWorkspace],
  );

  // Computed properties
  const hasWorkspaces = workspaces.length > 0;
  const workspacesCount = workspaces.length;
  const isDefaultWorkspace = currentWorkspace?.isDefault || false;

  return {
    // Data
    workspaces,
    currentWorkspace,
    isLoading,
    isCreating,
    error,

    // URL state
    workspaceId,
    viewMode,

    // Actions
    actions,

    // Computed
    hasWorkspaces,
    workspacesCount,
    isDefaultWorkspace,
  };
}

/**
 * Определяет режим просмотра из URL параметров
 */
function getViewModeFromParams(
  params: Record<string, unknown>,
): 'dashboard' | 'time-entry' | 'create' | 'select' {
  const pathname = (params.pathname as string) || '';

  if (pathname.includes('/create')) return 'create';
  if (pathname.includes('/select')) return 'select';
  if (pathname.includes('/time')) return 'time-entry';

  return 'dashboard';
}
