import { useCallback, useState } from 'react';
import { useDeleteTodoMutation } from '@/entities/todo';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface PendingDelete {
    id: string;
    text: string;
}

export function useDeleteTodo() {
    const [deleteTodo, { isLoading }] = useDeleteTodoMutation();
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

    const requestDelete = useCallback((todoId: string, todoText: string) => {
        setPendingDelete({ id: todoId, text: todoText });
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!pendingDelete) return;

        try {
            await deleteTodo(pendingDelete.id).unwrap();
            handleApiSuccess('Todo deleted successfully');
            setPendingDelete(null);
        } catch (error: unknown) {
            handleApiError(error as FetchBaseQueryError, 'Failed to delete todo');
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