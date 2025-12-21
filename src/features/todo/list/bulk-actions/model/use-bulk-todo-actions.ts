import { useCallback } from 'react';
import {
  useClearCompletedMutation,
  useToggleAllTodosMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useCreateTodoMutation,
  type Todo,
} from '@/entities/todo';
import { useAuth } from '@/features/auth';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { toast } from '@/shared/ui';

export function useBulkTodoActions() {
  const { userId } = useAuth();

  const [toggleAllTodos] = useToggleAllTodosMutation();
  const [clearCompleted] = useClearCompletedMutation();
  const [updateTodo] = useUpdateTodoMutation();
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

  const setSelectedCompleted = useCallback(
    async (ids: string[], completed: boolean) => {
      if (ids.length === 0) return;
      try {
        await Promise.all(ids.map((id) => updateTodo({ id, completed }).unwrap()));
        handleApiSuccess(completed ? 'Todos marked as completed' : 'Todos marked as active');
      } catch (error) {
        handleApiError(error as FetchBaseQueryError, 'Failed to update todos');
        throw error;
      }
    },
    [updateTodo],
  );

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

  const toggleAll = useCallback(
    async (completed: boolean) => {
      const uid = requireUserId();
      try {
        await toggleAllTodos({ userId: uid, completed }).unwrap();
        handleApiSuccess(
          completed ? 'All todos marked as completed' : 'All todos marked as active',
        );
      } catch (error) {
        handleApiError(error as FetchBaseQueryError, 'Failed to update todos');
        throw error;
      }
    },
    [requireUserId, toggleAllTodos],
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
    setSelectedCompleted,
    deleteSelected,
    toggleAll,
    clearCompletedAll,
  };
}
