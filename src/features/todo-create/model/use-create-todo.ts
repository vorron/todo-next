import { useCallback, useState } from 'react';
import { useCreateTodoMutation } from '@/entities/todo';
import { useAuth } from '@/features/auth';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import { createTodoSchema } from '@/entities/todo';
import { z } from 'zod';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

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
                    error: 'User not authenticated'
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
                if (error instanceof z.ZodError) {
                    const fieldErrors = error.issues.reduce((acc: Record<string, string>, issue) => {
                        const fieldName = issue.path[0]?.toString();
                        if (fieldName) {
                            acc[fieldName] = issue.message;
                        }
                        return acc;
                    }, {});

                    setErrors(fieldErrors);
                    return { success: false, errors: fieldErrors };
                }

                handleApiError(error as FetchBaseQueryError, 'Failed to create todo');
                return { success: false };
            }
        },
        [createTodo, userId]
    );

    return {
        create,
        isLoading,
        errors,
        clearErrors: () => setErrors({}),
    };
}