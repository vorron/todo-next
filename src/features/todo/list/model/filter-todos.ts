import type { Todo, FilterType } from '@/entities/todo';

export function filterTodos(todos: Todo[], filter: FilterType, search: string) {
  const normalizedSearch = search.toLowerCase();

  return (todos ?? []).filter((todo) => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;

    if (!normalizedSearch) return true;

    const textMatch = todo.text.toLowerCase().includes(normalizedSearch);
    const tagsMatch = (todo.tags ?? []).some((tag) => tag.toLowerCase() === normalizedSearch);

    return textMatch || tagsMatch;
  });
}
