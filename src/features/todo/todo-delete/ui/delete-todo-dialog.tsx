'use client';

import { ConfirmationDialog } from '@/shared/ui';

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