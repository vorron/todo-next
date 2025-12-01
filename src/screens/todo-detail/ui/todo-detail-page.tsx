"use client";

import { useRouter } from "next/navigation";
import { TodoStatusBadge } from "@/entities/todo";
import { useOptimisticToggle } from "@/features/todo/todo-update";
import { useDeleteTodo, DeleteTodoDialog } from "@/features/todo/todo-delete";
import { useTodoDetail } from "@/features/todo/model/use-todo-detail";
import {
  PageLoader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "@/shared/ui";
import { ROUTES } from "@/shared/config/routes";
import { formatDueDate, TODO_PRIORITY_LABELS } from "@/entities/todo";
import { ErrorStateCard } from "@/shared/ui/error-state-card/error-state-card";
import { XCircle } from "lucide-react";
import { useConfirm } from "@/shared/ui/dialog/confirm-dialog-provider";

interface TodoDetailPageProps {
  todoId: string;
}

export function TodoDetailPage({ todoId }: TodoDetailPageProps) {
  const router = useRouter();

  const { todo, isLoading, isError } = useTodoDetail(todoId);
  const { toggle, isLoading: isToggling } = useOptimisticToggle();
  const { deleteTodo, isLoading: isDeleting } = useDeleteTodo();
  const confirm = useConfirm();

  const handleDelete = async () => {
    if (!todo) return;

    const ok = await confirm({
      title: "Delete Todo?",
      description: `Are you sure you want to delete "${todo.text}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      variant: "danger",
    });

    if (!ok) return;

    try {
      await deleteTodo(todo.id);
      router.push(ROUTES.TODOS);
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
        onAction={() => router.push(ROUTES.TODOS)}
      />
    );
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(ROUTES.TODOS)}
            className="mb-4"
          >
            ← Back to Todos
          </Button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Todo Details</h1>
            <TodoStatusBadge completed={todo.completed} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-800">{todo.text}</p>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={todo.completed ? "secondary" : "primary"}
                    onClick={() => toggle(todo)}
                    isLoading={isToggling}
                    disabled={isToggling}
                  >
                    {todo.completed ? "Mark as Active" : "Mark as Completed"}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    disabled={isDeleting}
                  >
                    Delete Todo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metadata sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {TODO_PRIORITY_LABELS[todo.priority || "medium"]}
                </p>
              </CardContent>
            </Card>

            {todo.dueDate && (
              <Card>
                <CardHeader>
                  <CardTitle>Due Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {formatDueDate(todo.dueDate)}
                  </p>
                </CardContent>
              </Card>
            )}

            {todo.tags && todo.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Created</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {new Date(todo.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Last Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {new Date(todo.updatedAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
