import { useCallback } from 'react';

import { todoApi } from '@/entities/todo';
import { useAuth } from '@/features/auth';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useClearCompletedTodos() {
  const { userId } = useAuth();
  const [clearCompleted] = todoApi.endpoints.clearCompleted.useMutation();

  const clearCompletedAll = useCallback(async () => {
    if (!userId) {
      const error: FetchBaseQueryError = {
        status: 'CUSTOM_ERROR',
        error: 'User not authenticated',
      };
      handleApiError(error);
      throw error;
    }

    try {
      await clearCompleted(userId).unwrap();
      handleApiSuccess('Completed todos cleared');
    } catch (error) {
      handleApiError(error as FetchBaseQueryError, 'Failed to clear completed todos');
      throw error;
    }
  }, [clearCompleted, userId]);

  return {
    clearCompletedAll,
    isClearing: false, // TODO: Add proper loading state if needed
  };
}
