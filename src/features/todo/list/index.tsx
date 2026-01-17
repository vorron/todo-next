'use client';

import { useMemo } from 'react';

import {
  useTodos,
  useUndoableDeleteTodo,
  useToggleTodo,
  useBulkDeleteTodo,
  useClearCompletedTodos,
} from '@/features/todo/model';
import { useNavigation } from '@/shared/lib/router/navigation';
import { useConfirm } from '@/shared/ui/dialog/confirm-dialog-provider';

import { filterTodos } from './model/filter-todos';
import { sortTodos } from './model/sort-todos';
import { useTodoSelectionState } from './model/use-todo-selection';
import { ListSkeleton } from './ui/skeletons/todo-list-skeleton';
import { TodoActionsBar } from './ui/todo-actions-bar';
import { TodoCard } from './ui/todo-card';
import { TodoListEmpty } from './ui/todo-list-empty';
import { TodoListError } from './ui/todo-list-error';

import type { FilterType, TodoSortBy, Todo } from '@/entities/todo';

export interface TodoListProps {
  filter: FilterType;
  search: string;
  sortBy: TodoSortBy;
}

export function TodoList({ filter, search, sortBy }: TodoListProps) {
  // Data fetching
  const { todos, isLoading, error, refetch } = useTodos();

  const { toggleTodo } = useToggleTodo();
  const { deleteTodo } = useUndoableDeleteTodo();
  const { bulkDelete } = useBulkDeleteTodo();
  const { clearCompletedAll } = useClearCompletedTodos();

  // Navigation
  const { toTodoDetail, toTodoEdit } = useNavigation();

  // UI helpers
  const confirm = useConfirm();

  // Data processing
  const filteredTodos = useMemo(() => filterTodos(todos, filter, search), [todos, filter, search]);
  const displayTodos = useMemo(() => sortTodos(filteredTodos, sortBy), [filteredTodos, sortBy]);

  // Selection state
  const { selectedIds, toggleSelection, checkSelected, selectIds, clearSelection } =
    useTodoSelectionState();

  // Action handlers
  const handleTodoClick = (todo: Todo) => toTodoDetail(todo.id);
  const handleTodoEdit = (todo: Todo) => toTodoEdit(todo.id);
  const handleTodoToggle = (todo: Todo) => toggleTodo(todo);
  const handleTodoDelete = (todo: Todo) => deleteTodo(todo);
  const handleSelectionToggle = (todoId: string) => toggleSelection(todoId);
  const handleSelectAll = () => selectIds(displayTodos.map((todo) => todo.id));
  const handleDeleteSelected = () =>
    bulkDelete(displayTodos.filter((todo) => selectedIds.includes(todo.id)));

  if (isLoading) {
    return <ListSkeleton title="My Todos" />;
  }

  if (error) {
    return <TodoListError error={error} refetch={refetch} />;
  }

  if (displayTodos.length === 0) {
    return <TodoListEmpty hasSearch={search.length > 0} />;
  }

  return (
    <div className="space-y-3">
      <TodoActionsBar
        totalCount={displayTodos.length}
        selectedCount={selectedIds.length}
        hasCompleted={displayTodos.some((todo) => todo.completed)}
        actions={{
          clearSelection,
          clearCompletedAll,
          refetch,
          selectAll: handleSelectAll,
          delete: handleDeleteSelected,
        }}
      />
      <div className="text-xs text-slate-600">
        Всего: {displayTodos.length} &nbsp;|&nbsp; Выделено: {selectedIds.length}
      </div>
      {displayTodos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          confirm={confirm}
          selected={checkSelected(todo.id)}
          onSelectToggle={handleSelectionToggle}
          onToggleComplete={handleTodoToggle}
          onEdit={handleTodoEdit}
          onDelete={handleTodoDelete}
          onClick={handleTodoClick}
        />
      ))}
    </div>
  );
}
