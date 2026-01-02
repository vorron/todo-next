'use client';

import { FILTER_LABELS, SORT_LABELS } from '@/entities/todo/model/types';
import { useTodosViewState, useTodosViewUrlSync } from '@/features/todo/content/model';
import { TodoList } from '@/features/todo/list';
import { FilterButtons, Select } from '@/shared/ui';

import { CreateTodoForm } from './ui/create-todo-form';
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
        <FilterButtons value={filter} onChange={setFilter} valueLabels={FILTER_LABELS} />

        <div className="flex items-center gap-2">
          <TodoSearchInput value={search} onChange={setSearch} />
          <Select
            valueLabels={SORT_LABELS}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort todos"
          />
        </div>
      </div>

      <CreateTodoForm />

      <TodoList filter={filter} search={search} sortBy={sortBy} />
    </div>
  );
}
