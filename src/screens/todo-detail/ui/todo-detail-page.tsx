'use client';

import { XCircle } from 'lucide-react';

import { TodoDetailContent } from '@/features/todo/detail';
import { useTodoById, useUndoableDeleteTodo, useToggleTodo } from '@/features/todo/model';
import { ROUTES } from '@/shared/config/routes';
import { useNavigation } from '@/shared/lib/navigation';
import { PageLoader, ErrorStateCard, useHeaderFromTemplate, toast } from '@/shared/ui';
import { useConfirm } from '@/shared/ui/dialog/confirm-dialog-provider';

export function TodoDetailPage({ todoId }: { todoId: string }) {
  const { navigateToTodos } = useNavigation();

  const { todo, isLoading, error } = useTodoById(todoId);

  const { toggleTodo, isToggling } = useToggleTodo();
  const { deleteTodo, isDeleting } = useUndoableDeleteTodo();
  const confirm = useConfirm();

  useHeaderFromTemplate(todo, 'todoDetail');

  const handleDelete = async () => {
    if (!todo) return;

    if (
      !(await confirm({
        title: 'Delete Todo?',
        description: `Are you sure you want to delete "${todo.text}"? This action cannot be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        variant: 'danger',
      }))
    )
      return;

    try {
      await deleteTodo(todo);
      navigateToTodos();
    } catch (err) {
      console.error('Delete todo failed', err);
      toast.error('Failed to delete. Please try again.');
    }
  };

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
    <>
      <TodoDetailContent
        todo={todo}
        onToggle={() => toggleTodo(todo)}
        onDelete={handleDelete}
        isToggling={isToggling}
        isDeleting={isDeleting}
        backHref={ROUTES.TODOS}
        editHref={ROUTES.TODO_EDIT(todo.id)}
      />
    </>
  );
}
