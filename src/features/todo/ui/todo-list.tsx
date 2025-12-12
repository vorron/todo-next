'use client';

import { useOptimisticToggle } from '@/features/todo/todo-update';
import { useDeleteTodo } from '@/features/todo/todo-delete';
import {
  SkeletonList,
  EmptyTodos,
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
import type { FilterType } from '@/entities/todo';

interface TodoListProps {
  filter?: FilterType;
}

export function TodoList({ filter = 'all' }: TodoListProps) {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);

  const compactView = useAppSelector(selectCompactView);

  const { todos, isLoading, error, refetch } = useTodos();

  const { toggle } = useOptimisticToggle();

  const { deleteTodo } = useDeleteTodo();
  const confirm = useConfirm();

  const handleDelete = useCallback(
    async (id: string, text: string) => {
      const ok = await confirm({
        title: 'Delete Todo?',
        description: `Are you sure you want to delete "${text}"? This action cannot be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        variant: 'danger',
      });

      if (!ok) return;

      await deleteTodo(id);
    },
    [confirm, deleteTodo],
  );

  const handleTodoClick = useCallback(
    (id: string) => {
      router.push(ROUTES.TODO_DETAIL(id));
    },
    [router],
  );

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    refetch();
  }, [refetch]);

  // Фильтрация
  const filteredTodos = todos?.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

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
  if (!filteredTodos || filteredTodos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Todos</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyTodos
            onCreateClick={() => {
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              input?.focus();
            }}
          />
        </CardContent>
      </Card>
    );
  }

  // Success state
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Todos ({filteredTodos.length})</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                variant={compactView ? 'compact' : 'default'}
                onToggle={() => toggle(todo)}
                onDelete={() => handleDelete(todo.id, todo.text)}
                onClick={() => handleTodoClick(todo.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
