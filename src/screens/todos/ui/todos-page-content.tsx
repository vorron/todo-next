'use client';

import { useCallback } from 'react';

import { TodosFilterButtons } from '@/features/todo/filter-buttons/ui/todos-filter-buttons';
import { TodoList } from '@/features/todo/list/ui/todo-list';
import { CreateTodoForm } from '@/features/todo/todo-create';
import { TodoSearchInput } from '@/features/todo/todo-search';
import { TodoSortSelect } from '@/features/todo/todo-sort';
import { useTodosViewState, useTodosViewUrlSync } from '@/features/todo/view-state';
import { useDebounce } from '@/shared/lib/hooks';

export const TODOS_VIEW_DEBOUNCE_MS = 300;

export function TodosPageContent() {
  const view = useTodosViewState();
  const { filter, search, sortBy, setFilter, setSearch, setSortBy, reset } = view;
  const debouncedSearch = useDebounce(search, TODOS_VIEW_DEBOUNCE_MS);
  useTodosViewUrlSync(view, debouncedSearch);
  const focusCreateInput = useCallback(() => {
    const input = document.getElementById('create-todo-input') as HTMLInputElement | null;
    input?.focus();
  }, []);

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

      <TodoList
        filter={filter}
        search={debouncedSearch}
        sortBy={sortBy}
        onFocusCreateInput={focusCreateInput}
      />
      <div className="flex justify-end">
        <button type="button" className="text-xs text-blue-600 hover:underline" onClick={reset}>
          Reset view
        </button>
      </div>
    </div>
  );
}
