import { useCallback } from 'react';

import { todoApi, type Todo } from '@/entities/todo';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useUpdateTodo() {
  const [updateMutation, { isLoading: isUpdating }] = todoApi.endpoints.updateTodo.useMutation();

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
