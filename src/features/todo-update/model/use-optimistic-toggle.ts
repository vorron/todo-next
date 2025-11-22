import { useCallback } from 'react';
import { useUpdateTodoMutation } from '@/entities/todo';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import type { Todo } from '@/entities/todo';

/**
 * Hook для оптимистичного переключения статуса todo
 */
export function useOptimisticToggle() {
    const [updateTodo, { isLoading }] = useUpdateTodoMutation();

    const toggle = useCallback(
        async (todo: Todo) => {
            const previousCompleted = todo.completed;
            const newCompleted = !previousCompleted;

            try {
                await updateTodo({
                    id: todo.id,
                    completed: newCompleted,
                }).unwrap();

                // Успешно - показываем уведомление
                handleApiSuccess(
                    newCompleted ? 'Todo completed!' : 'Todo marked as active'
                );
            } catch (error: any) {
                // Ошибка - RTK Query автоматически откатит изменения
                handleApiError(error, 'Failed to update todo');
            }
        },
        [updateTodo]
    );

    return { toggle, isLoading };
}