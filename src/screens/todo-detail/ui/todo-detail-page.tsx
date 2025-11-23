'use client';

import { useGetTodoByIdQuery } from '@/entities/todo';
import { TodoStatusBadge } from '@/entities/todo';
import { useOptimisticToggle } from '@/features/todo-update';
import { useDeleteTodo, DeleteTodoDialog } from '@/features/todo-delete';
import { AuthGuard } from '@/features/auth';
import {
    PageLoader,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    AppErrorBoundary,
} from '@/shared/ui';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/config/routes';
import { formatDueDate, TODO_PRIORITY_LABELS } from '@/entities/todo';

interface TodoDetailPageProps {
    todoId: string;
}

export function TodoDetailPage({ todoId }: TodoDetailPageProps) {
    const router = useRouter();
    const { data: todo, isLoading, isError } = useGetTodoByIdQuery(todoId);
    const { toggle, isLoading: isToggling } = useOptimisticToggle();
    const { requestDelete, confirmDelete, cancelDelete, pendingDelete, isLoading: isDeleting } = useDeleteTodo();

    if (isLoading) {
        return (
            <AuthGuard>
                <PageLoader message="Loading todo details..." />
            </AuthGuard>
        );
    }

    if (isError || !todo) {
        return (
            <AuthGuard>
                <div className="container mx-auto py-8 px-4 max-w-4xl">
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Todo Not Found</h2>
                                <p className="text-gray-600 mb-6">
                                    The todo you're looking for doesn't exist or has been deleted.
                                </p>
                                <Button onClick={() => router.push(ROUTES.TODOS)}>
                                    Back to Todos
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard>
            <AppErrorBoundary>
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
                                            variant={todo.completed ? 'secondary' : 'primary'}
                                            onClick={() => toggle(todo)}
                                            isLoading={isToggling}
                                            disabled={isToggling}
                                        >
                                            {todo.completed ? 'Mark as Active' : 'Mark as Completed'}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => requestDelete(todo.id, todo.text)}
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
                                        {TODO_PRIORITY_LABELS[todo.priority || 'medium']}
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

                {/* Delete Confirmation */}
                {pendingDelete && (
                    <DeleteTodoDialog
                        isOpen={!!pendingDelete}
                        todoText={pendingDelete.text}
                        onConfirm={() => {
                            confirmDelete();
                            router.push(ROUTES.TODOS);
                        }}
                        onCancel={cancelDelete}
                        isLoading={isDeleting}
                    />
                )}
            </AppErrorBoundary>
        </AuthGuard>
    );
}