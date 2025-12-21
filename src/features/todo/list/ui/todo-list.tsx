'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/config/routes';
import { useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/ui';
import { useOptimisticToggle } from '@/features/todo/todo-update';
import { useUndoableDeleteTodo } from '@/features/todo/todo-delete';
import { useAppSelector } from '@/shared/lib/hooks';
import { selectCompactView } from '@/features/settings/model/selectors';
import { useTodos } from '../model/use-todos';
import { useConfirm } from '@/shared/ui/dialog/confirm-dialog-provider';
import { TodoCard } from './todo-card';
import type { FilterType, Todo, TodoSortBy } from '@/entities/todo';
import { TodoActionsBar, TodoSelectionProvider, useTodoSelection } from '../bulk-actions';
import { TodoListEmpty, TodoListLoading } from './todo-list-states';
import { useFilteredTodos, useSortedTodos } from '../model/use-todo-list-derivations';
import { TodoListError } from './todo-list-error';

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
  const { todos, isLoading, error, refetch } = useTodos();
  const { deleteTodo } = useUndoableDeleteTodo();

  const router = useRouter();
  const confirm = useConfirm();
  const compactView = useAppSelector(selectCompactView);
  const { toggle } = useOptimisticToggle();
  const { selectedIds, toggleSelection, checkSelected } = useTodoSelection();

  const handleDelete = useCallback(
    async (todo: Todo) => {
      const isCancelDelete = await confirm({
        title: 'Delete Todo?',
        description: `Are you sure you want to delete "${todo.text}"? This action cannot be undone.`,
      });

      if (isCancelDelete) return;

      await deleteTodo(todo);
    },
    [confirm, deleteTodo],
  );

  const { filtered, normalizedSearch } = useFilteredTodos(todos ?? [], filter, search);
  const sortedTodos = useSortedTodos(filtered, sortBy);

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
    const hasSearch = normalizedSearch.length > 0;
    const focusCreateInput = () => {
      const input = document.getElementById('create-todo-input') as HTMLInputElement | null;
      input?.focus();
    };

    return (
      <TodoListEmpty title="My Todos" hasSearch={hasSearch} onCreateClick={focusCreateInput} />
    );
  }

  // Success state
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch">
        <TodoActionsBar visibleTodos={sortedTodos} onRefresh={() => refetch()} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-slate-600">
          Всего: {sortedTodos.length} &nbsp;|&nbsp; Выделено: {selectedIds.length}
        </div>
        {sortedTodos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            variant={compactView ? 'compact' : 'default'}
            selected={checkSelected(todo.id)}
            onSelectToggle={() => toggleSelection(todo.id)}
            onToggleComplete={() => toggle(todo)}
            onEdit={() => router.push(ROUTES.TODO_EDIT(todo.id))}
            onDelete={() => handleDelete(todo)}
            onClick={() => router.push(ROUTES.TODO_DETAIL(todo.id))}
          />
        ))}
      </CardContent>
    </Card>
  );
}
