'use client';

import { useMemo } from 'react';

import { XCircle } from 'lucide-react';

import { TodoDetailContent, useTodoDetail } from '@/features/todo/detail';
import { ROUTES } from '@/shared/lib/router';
import { DataLoadingState, ErrorStateCard, useHeaderFromTemplate } from '@/shared/ui';

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

  // Memoize todo data to prevent infinite re-renders
  const memoizedTodo = useMemo(() => todo, [todo]);

  useHeaderFromTemplate(memoizedTodo, 'todoDetail');

  if (isLoading) {
    return <DataLoadingState message="Loading todo details..." />;
  }

  if (error || !memoizedTodo) {
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
      todo={memoizedTodo}
      onToggle={handleToggle}
      onDelete={handleDelete}
      isToggling={isToggling}
      isDeleting={isDeleting}
      backHref={ROUTES.TODOS}
      editHref={ROUTES.TODO_EDIT?.(memoizedTodo.id) || '#'}
    />
  );
}
