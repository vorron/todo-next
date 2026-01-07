import { workspaceApi } from '@/entities/workspace';

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
