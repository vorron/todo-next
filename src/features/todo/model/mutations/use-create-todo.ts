import { useCallback } from 'react';

import { todoApi } from '@/entities/todo';
import { useAuth } from '@/features/auth';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useCreateTodo() {
  const [createMutation, { isLoading: isCreating }] = todoApi.endpoints.createTodo.useMutation();
  const { userId } = useAuth();

  const createTodo = useCallback(
    async (data: { text: string; priority?: string; tags?: string[] }) => {
      if (!userId) {
        const error: FetchBaseQueryError = {
          status: 'CUSTOM_ERROR',
          error: 'User not authenticated',
        };
        handleApiError(error);
        throw error;
      }

      try {
        const todoData: {
          text: string;
          userId: string;
          completed: boolean;
          tags: string[];
          priority: 'high' | 'medium' | 'low';
        } = {
          text: data.text.trim(),
          userId,
          completed: false,
          tags: data.tags || [],
          priority: (data.priority as 'high' | 'medium' | 'low') || 'medium',
        };

        await createMutation(todoData).unwrap();

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
