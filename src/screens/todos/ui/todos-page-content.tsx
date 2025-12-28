'use client';

import { TodosFilterButtons } from '@/features/todo/filter-buttons/ui/todos-filter-buttons';
import { TodoList } from '@/features/todo/list/ui/todo-list';
import { CreateTodoForm } from '@/features/todo/todo-create';
import { TodoSearchInput } from '@/features/todo/todo-search';
import { TodoSortSelect } from '@/features/todo/todo-sort';
import { useDebounce } from '@/shared/lib/hooks';

import { useTodosView } from '../model/todos-view-context';
import { useTodosViewUrlSync } from '../model/use-todos-view-url-sync';

export const TODOS_VIEW_DEBOUNCE_MS = 300;

export function TodosPageContent() {
  const { filter, search, sortBy, setFilter, setSearch, setSortBy } = useTodosView();
  const debouncedSearch = useDebounce(search, TODOS_VIEW_DEBOUNCE_MS);
  useTodosViewUrlSync(debouncedSearch);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Todos</h1>
        <p className="text-gray-600">Manage your tasks efficiently</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TodosFilterButtons value={filter} onChange={setFilter} />

        <div className="flex items-center gap-2">
          <TodoSearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} />
          <TodoSortSelect value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      <CreateTodoForm />

      <TodoList filter={filter} search={debouncedSearch} sortBy={sortBy} />
    </div>
  );
}
