'use client';

import { AuthGuard } from '@/features/auth';
import { CreateTodoForm } from '@/features/todo-create';
import { TodoList } from '@/widgets/todo-list';
import { AppErrorBoundary } from '@/shared/ui';

export function TodosPage() {
    return (
        <AuthGuard>
            <AppErrorBoundary>
                <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Todos</h1>
                        <p className="text-gray-600">Manage your tasks efficiently</p>
                    </div>

                    <CreateTodoForm />

                    <TodoList />
                </div>
            </AppErrorBoundary>
        </AuthGuard>
    );
}