'use client';

import { XCircle } from 'lucide-react';

import { TodoDetailContent, useTodoDetail } from '@/features/todo/detail';
import { ROUTES } from '@/shared/config/routes';
import { PageLoader, ErrorStateCard, useHeaderFromTemplate } from '@/shared/ui';

export function TodoDetailPage({ todoId }: { todoId: string }) {
  const {
    todo,
    isLoading,
    error,
    handleDelete,
    handleToggle,
    isToggling,
    isDeleting,
    navigateToTodos,
  } = useTodoDetail(todoId);

  useHeaderFromTemplate(todo, 'todoDetail');

  if (isLoading) {
    return <PageLoader message="Loading todo details..." />;
  }

  if (error || !todo) {
    return (
      <ErrorStateCard
        icon={<XCircle className="w-8 h-8 text-red-600" />}
        title="Todo Not Found"
        description="The todo you're looking for doesn't exist or has been deleted."
        actionLabel="Back to Todos"
        onAction={navigateToTodos}
      />
    );
  }

  return (
    <TodoDetailContent
      todo={todo}
      onToggle={handleToggle}
      onDelete={handleDelete}
      isToggling={isToggling}
      isDeleting={isDeleting}
      backHref={ROUTES.TODOS}
      editHref={ROUTES.TODO_EDIT(todo.id)}
    />
  );
}
