import { useCallback } from 'react';

import { useUpdateTodoMutation, type Todo } from '@/entities/todo';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useUpdateTodoAction() {
  const [updateMutation, { isLoading: isUpdating }] = useUpdateTodoMutation();

  const updateTodo = useCallback(
    async (data: Todo) => {
      try {
        await updateMutation(data).unwrap();
        handleApiSuccess('Todo updated successfully');
      } catch (error) {
        handleApiError(error as FetchBaseQueryError, 'Failed to update todo');
        throw error;
      }
    },
    [updateMutation],
  );

  return {
    updateTodo,
    isUpdating,
  };
}
