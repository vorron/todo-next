import { useCallback } from 'react';

import { todoApi, type Todo } from '@/entities/todo';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useToggleTodo() {
  const [toggleTodoMutation, { isLoading: isToggling }] =
    todoApi.endpoints.toggleTodo.useMutation();

  const toggleTodo = useCallback(
    async (todo: Todo | undefined) => {
      if (!todo) return;

      const nextCompleted = !todo.completed;

      try {
        await toggleTodoMutation(todo.id).unwrap();
        handleApiSuccess(nextCompleted ? 'Todo completed!' : 'Todo marked as active');
      } catch (error: unknown) {
        handleApiError(error as FetchBaseQueryError, 'Failed to update todo');
        throw error;
      }
    },
    [toggleTodoMutation],
  );

  return {
    toggleTodo,
    isToggling,
  };
}
