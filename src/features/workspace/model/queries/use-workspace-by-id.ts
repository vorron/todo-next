/**
 * Workspace Query by ID Hook
 * RTK Query хук для получения конкретного workspace
 */

import { workspaceApi } from '@/entities/workspace/api/workspace-api';

export function useWorkspaceById(id: string) {
  const {
    data: workspace,
    isLoading,
    error,
    refetch,
  } = workspaceApi.endpoints.getWorkspaceById.useQuery(id);

  return {
    workspace,
    isLoading,
    error,
    refetch,
  };
}
