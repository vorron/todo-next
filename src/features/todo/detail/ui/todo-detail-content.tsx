import { formatDueDate } from '@/entities/todo';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { BackButton, NavigationButton } from '@/shared/ui/navigation-button';

import { TodoPriorityBadge } from './badges/todo-priority-badge';
import { TodoStatusBadge } from './badges/todo-status-badge';

import type { Todo } from '@/entities/todo/model/types';

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

interface TodoDetailContentProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  isToggling: boolean;
  isDeleting: boolean;
  backHref: string;
  editHref: string;
}

export function TodoDetailContent({
  todo,
  onToggle,
  onDelete,
  isToggling,
  isDeleting,
  backHref,
  editHref,
}: TodoDetailContentProps) {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6 space-y-3">
        <BackButton href={backHref} label="Back to Todos" className="mb-2" />
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={todo.completed ? 'secondary' : 'primary'}
              onClick={onToggle}
              isLoading={isToggling}
              disabled={isToggling}
            >
              {todo.completed ? 'Mark as Active' : 'Mark as Completed'}
            </Button>
            <NavigationButton href={editHref} className="inline-flex items-center">
              Edit Todo
            </NavigationButton>
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onDelete}
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
  );
}
