import type { Todo, TodoSortBy } from '@/entities/todo';

export function sortTodos(todos: Todo[], sortBy: TodoSortBy) {
  const getPriorityRank = (priority?: string) => {
    if (priority === 'high') return 3;
    if (priority === 'medium') return 2;
    if (priority === 'low') return 1;
    return 0;
  };

  const toTime = (t: { updatedAt?: string; createdAt?: string }) => {
    const raw = t.updatedAt ?? t.createdAt;
    return raw ? new Date(raw).getTime() : 0;
  };

  const compareFn = (a: Todo, b: Todo) => {
    if (sortBy === 'alphabetical') {
      return a.text.localeCompare(b.text);
    }

    if (sortBy === 'priority') {
      return getPriorityRank(b.priority) - getPriorityRank(a.priority);
    }

    return toTime(b) - toTime(a);
  };

  return [...(todos ?? [])].sort(compareFn);
}
