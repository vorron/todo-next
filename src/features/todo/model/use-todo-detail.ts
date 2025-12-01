import { useGetTodoByIdQuery, type Todo } from '@/entities/todo';

interface UseTodoDetailResult {
  todo: Todo | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useTodoDetail(id: string): UseTodoDetailResult {
  const { data, isLoading, isError } = useGetTodoByIdQuery(id);

  return {
    todo: data,
    isLoading,
    isError,
  };
}