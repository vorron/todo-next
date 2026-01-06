import { workspaceApi } from '@/entities/workspace/api/workspace-api';

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
