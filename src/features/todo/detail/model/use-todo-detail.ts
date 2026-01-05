import { useCallback } from 'react';

import { useNavigation } from '@/shared/lib/router/navigation';

import { useToggleTodo } from '../../model/mutations/use-toggle-todo';
import { useUndoableDeleteTodo } from '../../model/mutations/use-undoable-delete-todo';
import { useTodoById } from '../../model/queries';

import type { Todo } from '@/entities/todo/model/types';
import type { ApiError } from '@/shared/lib/errors';

interface UseTodoDetailResult {
  todo: Todo | undefined;
  isLoading: boolean;
  error?: ApiError;
  handleDelete: () => Promise<void>;
  handleToggle: () => Promise<void>;
  isToggling: boolean;
  isDeleting: boolean;
  navigateToTodos: () => void;
}

export function useTodoDetail(todoId: string): UseTodoDetailResult {
  const { todo, isLoading, error } = useTodoById(todoId);
  const { toggleTodo, isToggling } = useToggleTodo();
  const { deleteTodo, isDeleting } = useUndoableDeleteTodo();
  const { navigateToTodos } = useNavigation();

  const handleDelete = useCallback(async () => {
    await deleteTodo(todo);
    navigateToTodos();
  }, [todo, deleteTodo, navigateToTodos]);

  return {
    todo,
    isLoading,
    error,
    handleDelete,
    handleToggle: () => toggleTodo(todo),
    isToggling,
    isDeleting,
    navigateToTodos,
  };
}
