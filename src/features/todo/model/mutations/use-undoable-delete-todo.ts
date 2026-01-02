import { useCallback } from 'react';

import { todoApi, type Todo } from '@/entities/todo';
import { useAuth } from '@/features/auth';
import { handleApiError } from '@/shared/lib/errors';
import { toast } from '@/shared/ui';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useUndoableDeleteTodo() {
  const [deleteTodoMutation, { isLoading: isDeleting }] =
    todoApi.endpoints.deleteTodo.useMutation();
  const [createTodoMutation, { isLoading: isRestoring }] =
    todoApi.endpoints.createTodo.useMutation();
  const { userId } = useAuth();

  const deleteTodo = useCallback(
    async (todo: Todo) => {
      const effectiveUserId = todo.userId ?? userId;
      if (!effectiveUserId) {
        const error: FetchBaseQueryError = {
          status: 'CUSTOM_ERROR',
          error: 'User not authenticated',
        };
        handleApiError(error);
        throw error;
      }

      try {
        await deleteTodoMutation(todo.id).unwrap();

        toast.success('Todo deleted', {
          description: 'You can undo this action for a short time.',
          action: {
            label: 'Undo',
            onClick: () => {
              void (async () => {
                try {
                  await createTodoMutation({
                    text: todo.text,
                    userId: effectiveUserId,
                    completed: todo.completed,
                    priority: todo.priority,
                    dueDate: todo.dueDate,
                    tags: todo.tags ?? [],
                  }).unwrap();

                  toast.success('Todo restored');
                } catch (error: unknown) {
                  handleApiError(error as FetchBaseQueryError, 'Failed to restore todo');
                }
              })();
            },
          },
        });
      } catch (error: unknown) {
        handleApiError(error as FetchBaseQueryError, 'Failed to delete todo');
        throw error;
      }
    },
    [createTodoMutation, deleteTodoMutation, userId],
  );

  return {
    deleteTodo,
    isDeleting,
    isRestoring,
  };
}
