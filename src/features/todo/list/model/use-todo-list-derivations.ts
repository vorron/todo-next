import { useCallback, useMemo, useState } from 'react';
import type { FilterType, Todo, TodoSortBy } from '@/entities/todo';

export function useFilteredTodos(todos: Todo[], filter: FilterType, search: string) {
  return useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = todos.filter((todo) => {
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;

      if (!normalizedSearch) return true;

      const textMatch = todo.text.toLowerCase().includes(normalizedSearch);
      const tagsMatch = (todo.tags ?? []).some((tag) =>
        tag.toLowerCase().includes(normalizedSearch),
      );

      return textMatch || tagsMatch;
    });

    return { filtered, normalizedSearch };
  }, [filter, search, todos]);
}

export function useSortedTodos(todos: Todo[], sortBy: TodoSortBy) {
  return useMemo(() => {
    const rank = (p?: string) => {
      if (p === 'high') return 3;
      if (p === 'medium') return 2;
      if (p === 'low') return 1;
      return 0;
    };

    const toTime = (t: { updatedAt?: string; createdAt?: string }) => {
      const raw = t.updatedAt ?? t.createdAt;
      return raw ? new Date(raw).getTime() : 0;
    };

    return [...todos].sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.text.localeCompare(b.text);
      }

      if (sortBy === 'priority') {
        return rank(b.priority) - rank(a.priority);
      }

      return toTime(b) - toTime(a);
    });
  }, [sortBy, todos]);
}

export function useRetryableRefetch(refetch: () => void, maxRetries = 3) {
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    refetch();
  }, [refetch]);

  return {
    retryCount,
    retryDisabled: retryCount >= maxRetries,
    handleRetry,
  };
}
