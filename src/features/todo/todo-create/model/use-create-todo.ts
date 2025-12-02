import { useCallback, useState } from 'react';
import { useCreateTodoMutation } from '@/entities/todo';
import { useAuth } from '@/features/auth';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import { createTodoSchema } from '@/entities/todo';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { handleZodError } from '@/shared/lib/utils';

interface CreateResult {
  success: boolean;
  errors?: Record<string, string>;
}

export function useCreateTodo() {
  const [createTodo, { isLoading }] = useCreateTodoMutation();
  const { userId } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const create = useCallback(
    async (text: string, priority?: 'low' | 'medium' | 'high'): Promise<CreateResult> => {
      if (!userId) {
        const error: FetchBaseQueryError = {
          status: 'CUSTOM_ERROR',
          error: 'User not authenticated',
        };
        handleApiError(error);
        return { success: false };
      }

      try {
        const validatedData = createTodoSchema.parse({
          text,
          userId,
          completed: false,
          priority: priority || 'medium',
        });

        setErrors({});
        await createTodo(validatedData).unwrap();

        handleApiSuccess('Todo created successfully');
        return { success: true };
      } catch (error: unknown) {
        return handleZodError(error, {
          onZodError: (fieldErrors) => {
            setErrors(fieldErrors);
            return { success: false, errors: fieldErrors };
          },
          onOtherError: (error) => {
            handleApiError(error as FetchBaseQueryError, 'Failed to create todo');
            return { success: false };
          },
        });
      }
    },
    [createTodo, userId],
  );

  return {
    create,
    isLoading,
    errors,
    clearErrors: () => setErrors({}),
  };
}
