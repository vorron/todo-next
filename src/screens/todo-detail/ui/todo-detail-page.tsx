'use client';

import { useEffect } from 'react';

import { XCircle } from 'lucide-react';

import {
  formatDueDate,
  TODO_PRIORITY_COLORS,
  TODO_PRIORITY_LABELS,
  useGetTodoByIdQuery,
} from '@/entities/todo';
import { type TodoPriorityType } from '@/entities/todo/model/types';
import { TodoStatusBadge } from '@/features/todo/detail';
import { useTodos } from '@/features/todo/list';
import { useUndoableDeleteTodo } from '@/features/todo/model/use-undoable-delete-todo';
import { ROUTES } from '@/shared/config/routes';
import { useNavigation } from '@/shared/lib/navigation';
import { cn } from '@/shared/lib/utils/cn';
import {
  PageLoader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  ErrorStateCard,
  useHeader,
  NavigationButton,
} from '@/shared/ui';
import { useConfirm } from '@/shared/ui/dialog/confirm-dialog-provider';

interface TodoDetailPageProps {
  todoId: string;
}

export function TodoDetailPage({ todoId }: TodoDetailPageProps) {
  const { navigateToTodos } = useNavigation();
  const { setHeader } = useHeader();

  const { data: todo, isLoading, isError } = useGetTodoByIdQuery(todoId);

  const { toggleTodo, isLoading: isToggling } = useTodos();
  const { deleteTodo, isDeleting } = useUndoableDeleteTodo();
  const confirm = useConfirm();

  useEffect(() => {
    if (!todo) return;

    setHeader({
      title: todo.text,
      breadcrumbs: [
        { href: ROUTES.TODOS, label: 'Todos' },
        { href: ROUTES.TODO_DETAIL(todo.id), label: todo.text },
      ],
    });
  }, [setHeader, todo]);

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleDelete = async () => {
    if (!todo) return;

    const ok = await confirm({
      title: 'Delete Todo?',
      description: `Are you sure you want to delete "${todo.text}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });

    if (!ok) return;

    try {
      await deleteTodo(todo);
      navigateToTodos();
    } catch {
      //
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading todo details..." />;
  }

  if (isError || !todo) {
    return (
      <ErrorStateCard
        icon={<XCircle className="w-8 h-8 text-red-600" />}
        title="Todo Not Found"
        description="The todo you're looking for doesn't exist or has been deleted."
        actionLabel="Back to Todos"
        onAction={navigateToTodos}
      />
    );
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6 space-y-3">
          <NavigationButton href={ROUTES.TODOS} variant="ghost" className="mb-2">
            Back to Todos
          </NavigationButton>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <Button
                variant={todo.completed ? 'secondary' : 'primary'}
                onClick={() => toggleTodo(todo)}
                isLoading={isToggling}
                disabled={isToggling}
              >
                {todo.completed ? 'Mark as Active' : 'Mark as Completed'}
              </Button>
              <NavigationButton
                href={ROUTES.TODO_EDIT(todo.id)}
                variant="secondary"
                disabled={isToggling || isDeleting}
              >
                Edit Todo
              </NavigationButton>
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
                isLoading={isDeleting}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <TodoStatusBadge completed={todo.completed} className="self-start" />
              <TodoPriorityBadge priority={todo.priority || 'medium'} />

              <span className="flex items-center gap-1">
                Due:{' '}
                <span className="font-medium">
                  {todo.dueDate ? formatDueDate(todo.dueDate) : 'No due date'}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-800 leading-relaxed">{todo.text}</p>
              </CardContent>
            </Card>
          </div>

          {/* Metadata sidebar */}
          <div className="space-y-4 w-full">
            <Card className="w-full min-w-[260px]">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                {todo.tags && todo.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {todo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No tags</p>
                )}
              </CardContent>
            </Card>

            <Card className="w-full min-w-[260px]">
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-[auto,1fr] items-start gap-x-3 gap-y-2 text-sm text-gray-600">
                <span>Created</span>
                <span className="font-medium text-right whitespace-nowrap">
                  {formatDateTime(todo.createdAt)}
                </span>
                <span>Last Updated</span>
                <span className="font-medium text-right whitespace-nowrap">
                  {formatDateTime(todo.updatedAt)}
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function TodoPriorityBadge({ priority }: { priority: TodoPriorityType }) {
  const palette = TODO_PRIORITY_COLORS[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium border',
        palette.bg,
        palette.text,
        palette.border,
      )}
    >
      <span className={cn('h-2.5 w-2.5 rounded-full', palette.dot)} aria-hidden />
      Priority: {TODO_PRIORITY_LABELS[priority]}
    </span>
  );
}
