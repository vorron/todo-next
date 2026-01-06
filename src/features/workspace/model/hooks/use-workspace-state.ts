import { useMemo, useState } from 'react';

import { workspaceApi } from '@/entities/workspace/api/workspace-api';

import { useCreateWorkspace } from '../mutations/use-create-workspace';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceState {
  // State
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  currentWorkspaceId: string | null | undefined;
  workspaceType: 'create' | 'select' | 'dashboard';
  isLoading: boolean;
  isCreating: boolean;
  error: unknown;

  // Computed
  hasCurrentWorkspace: boolean;
  hasWorkspaces: boolean;
  workspacesCount: number;

  // Actions
  actions: {
    setCurrentWorkspace: (id: string | null | undefined) => void;
    setCurrentWorkspaceByObject: (workspace: Workspace | null) => void;
    goToCreateWorkspace: () => void;
    createWorkspace: (
      data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>,
    ) => Promise<Workspace>;
  };

  // Query actions
  refetch: () => void;
}

/**
 * Unified hook for workspace state management
 * Combines RTK Query data with local state for current workspace selection
 * Eliminates Redux duplication and simplifies state management
 */
export function useWorkspaceState(): WorkspaceState {
  const {
    data: workspaces = [],
    isLoading,
    error,
    refetch,
  } = workspaceApi.endpoints.getWorkspaces.useQuery();

  const { createWorkspace, isCreating } = useCreateWorkspace();

  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null | undefined>(
    undefined,
  );

  const currentWorkspace = useMemo(() => {
    // Only auto-select first workspace if no workspace was ever selected
    if (currentWorkspaceId === undefined && workspaces.length > 0) {
      return workspaces[0] || null;
    }
    return workspaces.find((workspace) => workspace.id === currentWorkspaceId) || null;
  }, [workspaces, currentWorkspaceId]);

  const workspaceType = useMemo(() => {
    if (currentWorkspaceId === 'CREATE') return 'create';
    if (workspaces.length === 0) return 'create';
    if (workspaces.length === 1 || currentWorkspace) return 'dashboard';
    return 'select';
  }, [workspaces, currentWorkspace, currentWorkspaceId]);

  const actions = useMemo(
    () => ({
      setCurrentWorkspace: (id: string | null | undefined) => setCurrentWorkspaceId(id),
      setCurrentWorkspaceByObject: (workspace: Workspace | null) =>
        setCurrentWorkspaceId(workspace?.id || null),
      goToCreateWorkspace: () => setCurrentWorkspaceId('CREATE'),
      createWorkspace,
    }),
    [createWorkspace],
  );

  return {
    // State
    workspaces,
    currentWorkspace,
    currentWorkspaceId,
    workspaceType,
    isLoading,
    isCreating,
    error,

    // Computed
    hasCurrentWorkspace: !!currentWorkspace,
    hasWorkspaces: workspaces.length > 0,
    workspacesCount: workspaces.length,

    // Actions
    actions,

    // Query actions
    refetch,
  };
}
