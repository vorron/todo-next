'use client';

import { TodosViewProvider } from './model/todos-view-context';
import { TodosPageContent } from './ui/todos-page-content';

export function TodosPage() {
  return (
    <TodosViewProvider>
      <TodosPageContent />
    </TodosViewProvider>
  );
}
