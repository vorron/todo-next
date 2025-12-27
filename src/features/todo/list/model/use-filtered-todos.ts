import type { Todo, FilterType } from '@/entities/todo';
import { useMemo } from 'react';

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
