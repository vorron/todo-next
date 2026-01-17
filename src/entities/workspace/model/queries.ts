/**
 * Workspace Entity Queries
 * Базовые query хуки для workspace сущности
 */

import { workspaceApi } from '../api/workspace-api';

export function useWorkspaces() {
  const {
    data: workspaces,
    isLoading,
    error,
    refetch,
  } = workspaceApi.endpoints.getWorkspaces.useQuery();

  return {
    workspaces: workspaces || [],
    isLoading,
    error,
    refetch,
  };
}

export function useWorkspaceById(id: string) {
  // Пропускаем запрос если id='skip'
  const skip = id === 'skip';
  const {
    data: workspace,
    isLoading,
    error,
    refetch,
  } = workspaceApi.endpoints.getWorkspaceById.useQuery(id, { skip });

  return {
    workspace,
    isLoading,
    error,
    refetch,
  };
}
