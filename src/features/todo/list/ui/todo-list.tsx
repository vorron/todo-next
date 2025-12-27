'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import type { FilterType, Todo, TodoSortBy } from '@/entities/todo';
import { useUndoableDeleteTodo } from '@/features/todo/model/use-undoable-delete-todo';
import { ROUTES } from '@/shared/config/routes';
import { Card, CardContent, CardHeader } from '@/shared/ui';
import { useConfirm } from '@/shared/ui/dialog/confirm-dialog-provider';

import { useTodos } from '../../model/use-todos';
import { sortTodos } from '../model/sort-todos';
import { TodoSelectionProvider, useTodoSelection } from '../model/todo-selection-context';
import { useBulkTodoActions } from '../model/use-bulk-todo-actions';
import { useFilteredTodos } from '../model/use-filtered-todos';

import { TodoActionsBar } from './todo-actions-bar';
import { TodoCard } from './todo-card';
import { TodoListError } from './todo-list-error';
import { TodoListEmpty, TodoListLoading } from './todo-list-states';

interface TodoListProps {
  filter?: FilterType;
  search?: string;
  sortBy?: TodoSortBy;
}

export function TodoList(props: TodoListProps) {
  return (
    <TodoSelectionProvider>
      <TodoListContent {...props} />
    </TodoSelectionProvider>
  );
}

function TodoListContent({ filter = 'all', search = '', sortBy = 'date' }: TodoListProps) {
  const router = useRouter();
  const confirm = useConfirm();

  const { todos, isLoading, error, refetch, toggleTodo } = useTodos();
  const { deleteTodo } = useUndoableDeleteTodo();

  const { selectedIds, toggleSelection, checkSelected, selectIds, clearSelection } =
    useTodoSelection();
  const { deleteSelected, clearCompletedAll } = useBulkTodoActions();

  const { filtered, normalizedSearch } = useFilteredTodos(todos ?? [], filter, search);
  const sortedTodos = useMemo(() => sortTodos(filtered, sortBy), [filtered, sortBy]);
  const selectedTodos = sortedTodos.filter((todo: Todo) => selectedIds.includes(todo.id));

  // Loading state
  if (isLoading) {
    return <TodoListLoading title="My Todos" />;
  }

  // Error state
  if (!!error) {
    return <TodoListError refetch={refetch} error={error} />;
  }

  // Empty state
  if (sortedTodos.length === 0) {
    return (
      <TodoListEmpty
        hasSearch={normalizedSearch.length > 0}
        onCreateClick={() => {
          const input = document.getElementById('create-todo-input') as HTMLInputElement | null;
          input?.focus();
        }}
      />
    );
  }

  // Success state
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch">
        <TodoActionsBar
          actions={{
            clearSelection,
            clearCompletedAll,
            refetch,
            selectAll: () => selectIds(sortedTodos.map((todo: Todo) => todo.id)),
            delete: () => deleteSelected(selectedTodos),
          }}
          visibleTodos={sortedTodos}
        />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-slate-600">
          Всего: {sortedTodos.length} &nbsp;|&nbsp; Выделено: {selectedIds.length}
        </div>
        {sortedTodos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            confirm={confirm}
            selected={checkSelected(todo.id)}
            onSelectToggle={() => toggleSelection(todo.id)}
            onToggleComplete={() => toggleTodo(todo)}
            onEdit={() => router.push(ROUTES.TODO_EDIT(todo.id))}
            onDelete={() => deleteTodo(todo)}
            onClick={() => router.push(ROUTES.TODO_DETAIL(todo.id))}
          />
        ))}
      </CardContent>
    </Card>
  );
}
