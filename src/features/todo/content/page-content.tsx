'use client';

import { useTodosViewState, useTodosViewUrlSync } from '@/features/todo/content/model';
import { TodosFilterButtons } from '@/features/todo/filter-buttons/ui/todos-filter-buttons';
import { TodoList } from '@/features/todo/list';
import { CreateTodoForm } from '@/features/todo/todo-create';
import { TodoSortSelect } from '@/features/todo/todo-sort';

import { TodoSearchInput } from './ui/search-input';

export function TodosPageContent() {
  const view = useTodosViewState();
  const { filter, search, sortBy, setFilter, setSearch, setSortBy } = view;

  useTodosViewUrlSync(view, search);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Todos</h1>
        <p className="text-gray-600">Manage your tasks efficiently</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TodosFilterButtons value={filter} onChange={setFilter} />

        <div className="flex items-center gap-2">
          <TodoSearchInput value={search} onChange={setSearch} />
          <TodoSortSelect value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      <CreateTodoForm />

      <TodoList filter={filter} search={search} sortBy={sortBy} />
    </div>
  );
}
