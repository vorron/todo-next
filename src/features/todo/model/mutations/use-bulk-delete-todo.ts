import { useCallback } from 'react';

import { todoApi, type Todo } from '@/entities/todo';
import { useAuth } from '@/features/auth';
import { handleApiError } from '@/shared/lib/errors';
import { toast } from '@/shared/ui';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useBulkDeleteTodo() {
  const { userId } = useAuth();
  const [deleteTodo] = todoApi.endpoints.deleteTodo.useMutation();
  const [createTodo] = todoApi.endpoints.createTodo.useMutation();

  const requireUserId = useCallback(() => {
    if (!userId) {
      const error: FetchBaseQueryError = {
        status: 'CUSTOM_ERROR',
        error: 'User not authenticated',
      };
      handleApiError(error);
      throw error;
    }
    return userId;
  }, [userId]);

  const bulkDelete = useCallback(
    async (todos: Todo[]) => {
      if (todos.length === 0) return;

      const restoreTodos = async () => {
        try {
          const uid = requireUserId();
          await Promise.all(
            todos.map((t) =>
              createTodo({
                text: t.text,
                userId: t.userId ?? uid,
                completed: t.completed,
                priority: t.priority,
                dueDate: t.dueDate,
                tags: t.tags ?? [],
              }).unwrap(),
            ),
          );
          toast.success('Todos restored');
        } catch (error) {
          handleApiError(error as FetchBaseQueryError, 'Failed to restore todos');
        }
      };

      try {
        await Promise.all(todos.map((t) => deleteTodo(t.id).unwrap()));

        toast.success('Todos deleted', {
          description: 'You can undo this action for a short time.',
          action: {
            label: 'Undo',
            onClick: () => {
              void restoreTodos();
            },
          },
        });
      } catch (error) {
        handleApiError(error as FetchBaseQueryError, 'Failed to delete todos');
        throw error;
      }
    },
    [createTodo, deleteTodo, requireUserId],
  );

  return {
    bulkDelete,
    isBulkDeleting: false, // TODO: Add proper loading state if needed
  };
}
