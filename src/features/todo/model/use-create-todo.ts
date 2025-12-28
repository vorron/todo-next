import { useCallback } from 'react';

import { useCreateTodoMutation } from '@/entities/todo';
import { useAuth } from '@/features/auth';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useCreateTodoAction() {
  const [createMutation, { isLoading: isCreating }] = useCreateTodoMutation();
  const { userId } = useAuth();

  const createTodo = useCallback(
    async (text: string, tags: string[], priority: 'low' | 'medium' | 'high' = 'medium') => {
      if (!userId) throw new Error('User not authenticated');

      try {
        await createMutation({
          text,
          userId,
          priority,
          completed: false,
          tags,
        }).unwrap();

        handleApiSuccess('Todo created successfully');
      } catch (error) {
        handleApiError(error as FetchBaseQueryError, 'Failed to create todo');
        throw error;
      }
    },
    [createMutation, userId],
  );

  return {
    createTodo,
    isCreating,
  };
}
