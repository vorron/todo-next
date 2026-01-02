'use client';

import { useRouter } from 'next/navigation';

import { XCircle } from 'lucide-react';

import { TodoForm } from '@/features/todo/form';
import { useTodoById } from '@/features/todo/model';
import { ROUTES } from '@/shared/config/routes';
import { BackButton, ErrorStateCard, PageLoader, useHeaderFromTemplate } from '@/shared/ui';

export function TodoEditPage({ todoId }: { todoId: string }) {
  const router = useRouter();

  const { todo, isLoading, error } = useTodoById(todoId);
  useHeaderFromTemplate(todo, 'todoEdit');

  if (isLoading) {
    return <PageLoader message="Loading todo..." />;
  }

  if (error || !todo) {
    return (
      <ErrorStateCard
        icon={<XCircle className="w-8 h-8 text-red-600" />}
        title="Todo Not Found"
        description="The todo you're trying to edit doesn't exist or has been deleted."
        actionLabel="Back to Todos"
        onAction={() => router.push(ROUTES.TODOS)}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
      <div>
        <BackButton href={ROUTES.TODO_DETAIL(todo.id)} label="Back to Todo" className="mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Edit Todo</h1>
        <p className="text-gray-600 mt-2">Update your task details</p>
      </div>
      <TodoForm mode="edit" todoId={todoId} />;
    </div>
  );
}
