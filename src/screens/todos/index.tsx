'use client';

import { TodosPageContent } from '@/features/todo/content';
import { useHeaderFromTemplate } from '@/shared/ui';

export function TodosPage() {
  useHeaderFromTemplate(null, 'todos');
  return <TodosPageContent />;
}
