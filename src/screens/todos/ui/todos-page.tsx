'use client';

import { CreateTodoForm } from '@/features/todo/todo-create';
import { TodoList } from '@/features/todo/ui/todo-list';
import { TodosFiltersProvider, useTodosFilters } from '../model/todos-filters-context';
import { TodosFiltersBar } from './todos-filters-bar';

export function TodosPage() {
  return (
    <TodosFiltersProvider>
      <TodosPageContent />
    </TodosFiltersProvider>
  );
}

function TodosPageContent() {
  const { filter } = useTodosFilters();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Todos</h1>
        <p className="text-gray-600">Manage your tasks efficiently</p>
      </div>

      <TodosFiltersBar />

      <CreateTodoForm />

      <TodoList filter={filter} />
    </div>
  );
}
