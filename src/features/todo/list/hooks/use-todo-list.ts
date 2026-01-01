'use client';

import { useMemo, useCallback } from 'react';

import { useUndoableDeleteTodo, useToggleTodoAction, useTodos } from '@/features/todo/model';
import { useNavigation } from '@/shared/lib/navigation';
import { useConfirm } from '@/shared/ui/dialog/confirm-dialog-provider';

import { sortTodos } from '../model/sort-todos';
import { useBulkTodoActions } from '../model/use-bulk-todo-actions';
import { useFilteredTodos } from '../model/use-filtered-todos';
import { useTodoSelectionState } from '../model/use-todo-selection';

import type { Todo, FilterType, TodoSortBy } from '@/entities/todo';

interface UseTodoListProps {
  filter: FilterType;
  search: string;
  sortBy: TodoSortBy;
  onTodoClick?: (todo: Todo) => void;
  onTodoEdit?: (todo: Todo) => void;
  confirmOverride?: ReturnType<typeof useConfirm>;
}

export function useTodoList({
  filter,
  search,
  sortBy,
  onTodoClick,
  onTodoEdit,
  confirmOverride,
}: UseTodoListProps) {
  const { navigateToTodoDetail, navigateToTodoEdit } = useNavigation();
  const confirmDefault = useConfirm();
  const confirm = confirmOverride ?? confirmDefault;

  // Data fetching
  const { todos, isLoading, error, refetch } = useTodos();
  const { toggleTodo } = useToggleTodoAction();
  const { deleteTodo } = useUndoableDeleteTodo();

  // Selection state
  const { selectedIds, toggleSelection, checkSelected, selectIds, clearSelection } =
    useTodoSelectionState();
  const { deleteSelected, clearCompletedAll } = useBulkTodoActions();

  // Data processing
  const { filtered, normalizedSearch } = useFilteredTodos(todos ?? [], filter, search);
  const sortedTodos = useMemo(() => sortTodos(filtered, sortBy), [filtered, sortBy]);
  const selectedTodos = useMemo(
    () => sortedTodos.filter((todo: Todo) => selectedIds.includes(todo.id)),
    [sortedTodos, selectedIds],
  );

  // Action handlers
  const handleTodoClick = useCallback(
    (todo: Todo) => {
      if (onTodoClick) return onTodoClick(todo);
      navigateToTodoDetail(todo.id);
    },
    [navigateToTodoDetail, onTodoClick],
  );

  const handleTodoEdit = useCallback(
    (todo: Todo) => {
      if (onTodoEdit) return onTodoEdit(todo);
      navigateToTodoEdit(todo.id);
    },
    [navigateToTodoEdit, onTodoEdit],
  );

  const handleTodoToggle = useCallback((todo: Todo) => toggleTodo(todo), [toggleTodo]);

  const handleTodoDelete = useCallback((todo: Todo) => deleteTodo(todo), [deleteTodo]);

  const handleSelectionToggle = useCallback(
    (todoId: string) => toggleSelection(todoId),
    [toggleSelection],
  );

  const handleSelectAll = useCallback(
    () => selectIds(sortedTodos.map((todo: Todo) => todo.id)),
    [sortedTodos, selectIds],
  );

  const handleDeleteSelected = useCallback(
    () => deleteSelected(selectedTodos),
    [deleteSelected, selectedTodos],
  );

  // Stats
  const stats = useMemo(
    () => ({
      total: sortedTodos.length,
      selected: selectedIds.length,
      hasSelected: selectedIds.length > 0,
      hasCompleted: sortedTodos.some((todo) => todo.completed),
    }),
    [sortedTodos, selectedIds],
  );

  return {
    // Data
    todos: sortedTodos,
    selectedTodos,
    isLoading,
    error,
    hasItems: sortedTodos.length > 0,
    normalizedSearch,
    stats,

    // Selection
    selectedIds,
    checkSelected,
    clearSelection,

    // Actions
    handlers: {
      onTodoClick: handleTodoClick,
      onTodoEdit: handleTodoEdit,
      onTodoToggle: handleTodoToggle,
      onTodoDelete: handleTodoDelete,
      onSelectionToggle: handleSelectionToggle,
      onSelectAll: handleSelectAll,
      onDeleteSelected: handleDeleteSelected,
      onClearCompletedAll: clearCompletedAll,
      onRefetch: refetch,
    },

    // UI helpers
    confirm,
  };
}
