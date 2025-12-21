'use client';

import { TodosFiltersProvider } from './model/todos-filters-context';
import { TodosPageContent } from './ui/todos-page-content';

export function TodosPage() {
  return (
    <TodosFiltersProvider>
      <TodosPageContent />
    </TodosFiltersProvider>
  );
}
