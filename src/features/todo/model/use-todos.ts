import { useCallback } from 'react';
import { useAuth } from '@/features/auth';
import {
    useGetTodosQuery,
    useCreateTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation
} from '@/entities/todo';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useTodos() {
    const { userId } = useAuth();
    const { data: todos, isLoading, error, refetch } = useGetTodosQuery(
        userId ? { userId } : undefined,
        { skip: !userId }
    );

    const [createMutation] = useCreateTodoMutation();
    const [updateMutation] = useUpdateTodoMutation();
    const [deleteMutation] = useDeleteTodoMutation();

    const createTodo = useCallback(async (text: string, tags: string[], priority?: 'low' | 'medium' | 'high') => {
        if (!userId) throw new Error('User not authenticated');

        try {
            await createMutation({
                text,
                userId,
                priority: priority || 'medium',
                completed: false,
                tags
            }).unwrap();
            handleApiSuccess('Todo created successfully');
        } catch (error) {
            handleApiError(error as FetchBaseQueryError, 'Failed to create todo');
            throw error;
        }
    }, [createMutation, userId]);

    const updateTodo = useCallback(async (data: { id: string; completed?: boolean; text?: string }) => {
        try {
            await updateMutation(data).unwrap();
            handleApiSuccess('Todo updated successfully');
        } catch (error) {
            handleApiError(error as FetchBaseQueryError, 'Failed to update todo');
            throw error;
        }
    }, [updateMutation]);

    const deleteTodo = useCallback(async (id: string) => {
        try {
            await deleteMutation(id).unwrap();
            handleApiSuccess('Todo deleted successfully');
        } catch (error) {
            handleApiError(error as FetchBaseQueryError, 'Failed to delete todo');
            throw error;
        }
    }, [deleteMutation]);

    const toggleTodo = useCallback(async (todo: { id: string; completed: boolean }) => {
        return updateTodo({
            id: todo.id,
            completed: !todo.completed,
        });
    }, [updateTodo]);

    return {
        todos: todos || [],
        isLoading,
        error,
        refetch,
        createTodo,
        updateTodo,
        deleteTodo, // Добавляем deleteTodo в возвращаемый объект
        toggleTodo,
    };
}