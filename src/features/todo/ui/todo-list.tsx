'use client';

import { useOptimisticToggle } from '@/features/todo/todo-update';
import { useUndoableDeleteTodo } from '@/features/todo/todo-delete';
import {
  SkeletonList,
  EmptyTodos,
  EmptySearchResults,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from '@/shared/ui';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/config/routes';
import { useCallback, useState } from 'react';
import { useAppSelector } from '@/shared/lib/hooks';
import { selectCompactView } from '@/features/settings/model/selectors';
import { useTodos } from '../model/use-todos';
import { useConfirm } from '@/shared/ui/dialog/confirm-dialog-provider';
import { TodoCard } from './todo-card';
import type { FilterType, Todo, TodoSortBy } from '@/entities/todo';
import { TodoBulkActionsBar, useTodoSelection } from '@/features/todo/todo-bulk-actions';

interface TodoListProps {
  filter?: FilterType;
  search?: string;
  sortBy?: TodoSortBy;
}

export function TodoList({ filter = 'all', search = '', sortBy = 'date' }: TodoListProps) {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);

  const compactView = useAppSelector(selectCompactView);

  const { todos, isLoading, error, refetch } = useTodos();

  const { toggle } = useOptimisticToggle();

  const { selectionMode, toggleId, isSelected } = useTodoSelection();

  const { deleteTodo } = useUndoableDeleteTodo();
  const confirm = useConfirm();

  const handleDelete = useCallback(
    async (todo: Todo) => {
      const ok = await confirm({
        title: 'Delete Todo?',
        description: `Are you sure you want to delete "${todo.text}"? This action cannot be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        variant: 'danger',
      });

      if (!ok) return;

      await deleteTodo(todo);
    },
    [confirm, deleteTodo],
  );

  const handleTodoClick = useCallback(
    (id: string) => {
      if (selectionMode) {
        toggleId(id);
        return;
      }
      router.push(ROUTES.TODO_DETAIL(id));
    },
    [router, selectionMode, toggleId],
  );

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    refetch();
  }, [refetch]);

  // Фильтрация
  const normalizedSearch = search.trim().toLowerCase();
  const filteredTodos = todos?.filter((todo) => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;

    if (!normalizedSearch) return true;

    const textMatch = todo.text.toLowerCase().includes(normalizedSearch);
    const tagsMatch = (todo.tags ?? []).some((tag) => tag.toLowerCase().includes(normalizedSearch));

    return textMatch || tagsMatch;
  });

  const sortedTodos = filteredTodos
    ? [...filteredTodos].sort((a, b) => {
        if (sortBy === 'alphabetical') {
          return a.text.localeCompare(b.text);
        }

        if (sortBy === 'priority') {
          const rank = (p?: string) => {
            if (p === 'high') return 3;
            if (p === 'medium') return 2;
            if (p === 'low') return 1;
            return 0;
          };
          return rank(b.priority) - rank(a.priority);
        }

        const toTime = (t: { updatedAt?: string; createdAt?: string }) => {
          const raw = t.updatedAt ?? t.createdAt;
          return raw ? new Date(raw).getTime() : 0;
        };
        return toTime(b) - toTime(a);
      })
    : [];

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Todos</CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonList count={5} />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (!!error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Todos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load todos</h3>
            <p className="text-sm text-gray-600 mb-4">
              {error && 'status' in error ? `Error: ${error.status}` : 'Please try again'}
            </p>
            <Button onClick={handleRetry} variant="primary" disabled={retryCount > 2}>
              {retryCount > 2 ? 'Please refresh page' : 'Try Again'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (sortedTodos.length === 0) {
    const hasSearch = normalizedSearch.length > 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle>My Todos</CardTitle>
        </CardHeader>
        <CardContent>
          {hasSearch ? (
            <EmptySearchResults />
          ) : (
            <EmptyTodos
              onCreateClick={() => {
                const input = document.getElementById(
                  'create-todo-input',
                ) as HTMLInputElement | null;
                input?.focus();
              }}
            />
          )}
        </CardContent>
      </Card>
    );
  }

  // Success state
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Todos ({sortedTodos.length})</CardTitle>
          <div className="flex gap-2">
            <TodoBulkActionsBar allTodos={todos ?? []} visibleTodos={sortedTodos} />
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                variant={compactView ? 'compact' : 'default'}
                selectionMode={selectionMode}
                selected={isSelected(todo.id)}
                onSelectToggle={() => toggleId(todo.id)}
                onToggle={selectionMode ? undefined : () => toggle(todo)}
                onDelete={selectionMode ? undefined : () => handleDelete(todo)}
                onClick={() => handleTodoClick(todo.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
