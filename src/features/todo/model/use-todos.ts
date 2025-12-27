import { useCallback } from 'react';
import { useAuth } from '@/features/auth';
import {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoMutation,
  type Todo,
} from '@/entities/todo';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useTodos() {
  const { userId } = useAuth();

  const {
    data: todos,
    isLoading,
    error,
    refetch,
  } = useGetTodosQuery(userId ? { userId } : undefined, { skip: !userId });

  const [createMutation] = useCreateTodoMutation();
  const [updateMutation] = useUpdateTodoMutation();
  const [toggleMutation, { isLoading: isToggling }] = useToggleTodoMutation();
  const [deleteMutation] = useDeleteTodoMutation();

  const createTodo = useCallback(
    async (text: string, tags: string[], priority?: 'low' | 'medium' | 'high') => {
      if (!userId) throw new Error('User not authenticated');

      try {
        await createMutation({
          text,
          userId,
          priority: priority || 'medium',
          completed: false,
          tags,
        }).unwrap();
        handleApiSuccess('Todo created successfully');
      } catch (error) {
        handleApiError(error as FetchBaseQueryError, 'Failed to create todo');
        throw error;
      }
    },
    [createMutation, userId],
  );

  const updateTodo = useCallback(
    async (data: Todo) => {
      try {
        await updateMutation(data).unwrap();
        handleApiSuccess('Todo updated successfully');
      } catch (error) {
        handleApiError(error as FetchBaseQueryError, 'Failed to update todo');
        throw error;
      }
    },
    [updateMutation],
  );

  const toggleTodo = useCallback(
    async (todo: Todo) => {
      const newCompleted = !todo.completed;

      try {
        await toggleMutation(todo.id).unwrap();

        handleApiSuccess(newCompleted ? 'Todo completed!' : 'Todo marked as active');
      } catch (error: unknown) {
        handleApiError(error as FetchBaseQueryError, 'Failed to update todo');
      }
    },
    [toggleMutation],
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      try {
        await deleteMutation(id).unwrap();
        handleApiSuccess('Todo deleted successfully');
      } catch (error) {
        handleApiError(error as FetchBaseQueryError, 'Failed to delete todo');
        throw error;
      }
    },
    [deleteMutation],
  );

  return {
    todos: todos || [],
    isLoading,
    error,
    refetch,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    isToggling,
  };
}
