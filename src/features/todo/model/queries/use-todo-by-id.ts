import { todoApi } from '@/entities/todo';

export function useTodoById(id: string) {
  // Пропускаем запрос если id='skip'
  const skip = id === 'skip';
  const {
    data: todo,
    isLoading,
    error,
    refetch,
  } = todoApi.endpoints.getTodoById.useQuery(id, { skip });

  return {
    todo,
    isLoading,
    error,
    refetch,
  };
}
