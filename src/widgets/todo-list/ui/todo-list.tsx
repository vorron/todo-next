'use client';

import { useGetTodosQuery } from '@/entities/todo';
import { TodoCard } from '@/entities/todo';
import { useAuth } from '@/features/auth';
import { useOptimisticToggle } from '@/features/todo-update';
import { useDeleteTodo, DeleteTodoDialog } from '@/features/todo-delete';
import {
    SkeletonList,
    EmptyTodos,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/shared/ui';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/config/routes';

interface TodoListProps {
    filter?: 'all' | 'active' | 'completed';
}

export function TodoList({ filter = 'all' }: TodoListProps) {
    const { userId } = useAuth();
    const router = useRouter();

    const {
        data: todos,
        isLoading,
        isError,
    } = useGetTodosQuery(userId ? { userId } : undefined, {
        skip: !userId,
    });

    const { toggle } = useOptimisticToggle();
    const { requestDelete, confirmDelete, cancelDelete, pendingDelete, isLoading: isDeleting } = useDeleteTodo();

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
    if (isError) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Todos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Failed to load todos</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Please try again or contact support if the problem persists.
                        </p>
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
                    <EmptyTodos onCreateClick={() => {
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                        input?.focus();
                    }} />
                </CardContent>
            </Card>
        );
    }

    // Success state
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        My Todos ({filteredTodos.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredTodos.map((todo) => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                onToggle={() => toggle(todo)}
                                onDelete={() => requestDelete(todo.id, todo.text)}
                                onClick={() => router.push(ROUTES.TODO_DETAIL(todo.id))}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            {pendingDelete && (
                <DeleteTodoDialog
                    isOpen={!!pendingDelete}
                    todoText={pendingDelete.text}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    isLoading={isDeleting}
                />
            )}
        </>
    );
}