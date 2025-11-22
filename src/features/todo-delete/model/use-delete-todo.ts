import { useCallback, useState } from 'react';
import { useDeleteTodoMutation } from '@/entities/todo';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';

/**
 * Hook для удаления todo с подтверждением через dialog
 */
export function useDeleteTodo() {
    const [deleteTodo, { isLoading }] = useDeleteTodoMutation();
    const [pendingDelete, setPendingDelete] = useState<{
        id: string;
        text: string;
    } | null>(null);

    const requestDelete = useCallback((todoId: string, todoText: string) => {
        setPendingDelete({ id: todoId, text: todoText });
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!pendingDelete) return;

        try {
            await deleteTodo(pendingDelete.id).unwrap();
            handleApiSuccess('Todo deleted successfully');
            setPendingDelete(null);
        } catch (error: any) {
            handleApiError(error, 'Failed to delete todo');
        }
    }, [deleteTodo, pendingDelete]);

    const cancelDelete = useCallback(() => {
        setPendingDelete(null);
    }, []);

    return {
        requestDelete,
        confirmDelete,
        cancelDelete,
        pendingDelete,
        isLoading,
    };
}