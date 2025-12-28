import { useGetTodosQuery } from '@/entities/todo';
import { useAuth } from '@/features/auth';

export function useTodos() {
  const { userId } = useAuth();

  const {
    data: todos,
    isLoading,
    error,
    refetch,
  } = useGetTodosQuery(userId ? { userId } : undefined, { skip: !userId });

  return {
    todos: todos || [],
    isLoading,
    error,
    refetch,
  };
}
