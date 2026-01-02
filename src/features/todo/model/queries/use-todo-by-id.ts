import { todoApi } from '@/entities/todo';

export function useTodoById(id: string) {
  const { data: todo, isLoading, error, refetch } = todoApi.endpoints.getTodoById.useQuery(id);

  return {
    todo,
    isLoading,
    error,
    refetch,
  };
}
