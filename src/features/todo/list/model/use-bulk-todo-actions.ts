import { useCallback } from 'react';

import {
  useClearCompletedMutation,
  useDeleteTodoMutation,
  useCreateTodoMutation,
  type Todo,
} from '@/entities/todo';
import { useAuth } from '@/features/auth';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import { toast } from '@/shared/ui';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useBulkTodoActions() {
  const { userId } = useAuth();

  const [clearCompleted] = useClearCompletedMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [createTodo] = useCreateTodoMutation();

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

  const deleteSelected = useCallback(
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

  const clearCompletedAll = useCallback(async () => {
    const uid = requireUserId();
    try {
      await clearCompleted(uid).unwrap();
      handleApiSuccess('Completed todos cleared');
    } catch (error) {
      handleApiError(error as FetchBaseQueryError, 'Failed to clear completed todos');
      throw error;
    }
  }, [clearCompleted, requireUserId]);

  return {
    deleteSelected,
    clearCompletedAll,
  };
}
