import { useMemo } from 'react';

import { todoApi } from '@/entities/todo';

export function useTodos() {
  const { data: todos, isLoading, error, refetch } = todoApi.endpoints.getTodos.useQuery();

  const processedTodos = useMemo(() => {
    return todos ?? [];
  }, [todos]);

  return {
    todos: processedTodos,
    isLoading,
    error,
    refetch,
  };
}
