import { useCallback, useState } from 'react';
import { useCreateTodoMutation } from '@/entities/todo';
import { useAuth } from '@/features/auth';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import { createTodoSchema } from '@/entities/todo';
import { z } from 'zod';

/**
 * Hook для создания todo с валидацией
 */
export function useCreateTodo() {
    const [createTodo, { isLoading }] = useCreateTodoMutation();
    const { userId } = useAuth();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const create = useCallback(
        async (text: string, priority?: 'low' | 'medium' | 'high') => {
            if (!userId) {
                handleApiError({ message: 'User not authenticated' } as any);
                return { success: false };
            }

            try {
                // Валидация
                const validatedData = createTodoSchema.parse({
                    text,
                    userId,
                    completed: false,
                    priority: priority || 'medium',
                });

                setErrors({});

                // Создание
                await createTodo(validatedData).unwrap();

                handleApiSuccess('Todo created successfully');
                return { success: true };
            } catch (error: any) {
                if (error instanceof z.ZodError) {
                    const fieldErrors: Record<string, string> = {};
                    error.errors.forEach((err) => {
                        fieldErrors[err.path[0]] = err.message;
                    });
                    setErrors(fieldErrors);
                    return { success: false, errors: fieldErrors };
                }

                handleApiError(error, 'Failed to create todo');
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