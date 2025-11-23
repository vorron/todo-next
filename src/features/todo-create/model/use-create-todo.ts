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
            } catch (error) {
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
                // Обработка других типов ошибок
                throw error;
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