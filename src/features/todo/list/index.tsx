'use client';

import { useTodoList } from './hooks/use-todo-list';
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
  onTodoClick?: (todo: Todo) => void;
  onTodoEdit?: (todo: Todo) => void;
}

/**
 * Facade component.
 */
export function TodoList({
  filter,
  search,
  sortBy,
  onTodoClick: onTodoClickProp,
  onTodoEdit: onTodoEditProp,
}: TodoListProps) {
  const {
    todos,
    isLoading,
    error,
    hasItems,
    normalizedSearch,
    stats,
    checkSelected,
    clearSelection,
    handlers,
    confirm,
  } = useTodoList({
    filter,
    search,
    sortBy,
    onTodoClick: onTodoClickProp,
    onTodoEdit: onTodoEditProp,
  });

  const {
    onSelectionToggle,
    onTodoToggle,
    onTodoEdit: onTodoEditHandler,
    onTodoDelete,
    onTodoClick: onTodoClickHandler,
    onClearCompletedAll,
    onRefetch,
    onSelectAll,
    onDeleteSelected,
  } = handlers;

  if (isLoading) {
    return <ListSkeleton title="My Todos" />;
  }

  if (error) {
    return <TodoListError error={error} refetch={onRefetch} />;
  }

  if (!hasItems) {
    return <TodoListEmpty hasSearch={normalizedSearch.length > 0} />;
  }

  return (
    <div className="space-y-3">
      <TodoActionsBar
        totalCount={stats.total}
        selectedCount={stats.selected}
        hasCompleted={stats.hasCompleted}
        actions={{
          clearSelection,
          clearCompletedAll: onClearCompletedAll,
          refetch: onRefetch,
          selectAll: onSelectAll,
          delete: onDeleteSelected,
        }}
      />
      <div className="text-xs text-slate-600">
        Всего: {stats.total} &nbsp;|&nbsp; Выделено: {stats.selected}
      </div>
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          confirm={confirm}
          selected={checkSelected(todo.id)}
          onSelectToggle={onSelectionToggle}
          onToggleComplete={onTodoToggle}
          onEdit={onTodoEditHandler}
          onDelete={onTodoDelete}
          onClick={onTodoClickHandler}
        />
      ))}
    </div>
  );
}
