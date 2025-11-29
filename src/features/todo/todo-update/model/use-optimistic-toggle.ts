import { useCallback } from 'react';
import { useUpdateTodoMutation } from '@/entities/todo';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import type { Todo } from '@/entities/todo';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

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

                handleApiSuccess(
                    newCompleted ? 'Todo completed!' : 'Todo marked as active'
                );
            } catch (error: unknown) {
                handleApiError(error as FetchBaseQueryError, 'Failed to update todo');
            }
        },
        [updateTodo]
    );

    return { toggle, isLoading };
}