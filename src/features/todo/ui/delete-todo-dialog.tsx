'use client';

import { useState, useCallback } from 'react';
import { ConfirmationDialog } from '@/shared/ui';
import { useTodos } from '../model/use-todos';

interface PendingDelete {
    id: string;
    text: string;
}

export function useDeleteTodo() {
    const { deleteTodo } = useTodos();
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const requestDelete = useCallback((todoId: string, todoText: string) => {
        setPendingDelete({ id: todoId, text: todoText });
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!pendingDelete) return;

        setIsLoading(true);
        try {
            await deleteTodo(pendingDelete.id);
            setPendingDelete(null);
        } catch (error) {
            console.error('Failed to delete todo:', error);
        } finally {
            setIsLoading(false);
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

interface DeleteTodoDialogProps {
    isOpen: boolean;
    todoText: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function DeleteTodoDialog({
    isOpen,
    todoText,
    onConfirm,
    onCancel,
    isLoading,
}: DeleteTodoDialogProps) {
    return (
        <ConfirmationDialog
            isOpen={isOpen}
            onClose={onCancel}
            onConfirm={onConfirm}
            title="Delete Todo?"
            description={`Are you sure you want to delete "${todoText}"? This action cannot be undone.`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            variant="danger"
            isLoading={isLoading}
        />
    );
}