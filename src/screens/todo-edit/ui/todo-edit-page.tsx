'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';

import { useUpdateTodoMutation, TODO_PRIORITY_LABELS } from '@/entities/todo';
import { useTodoDetail } from '@/features/todo/model/use-todo-detail';
import { ROUTES } from '@/shared/config/routes';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import { handleZodError } from '@/shared/lib/utils';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorStateCard,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PageLoader,
  useHeader,
} from '@/shared/ui';
import { Input } from '@/shared/ui/input-primitive';

const editTodoFormSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Todo text is required')
    .max(500, 'Todo text must be at most 500 characters'),
  priority: z.enum(['low', 'medium', 'high']),
});

type EditTodoFormData = z.infer<typeof editTodoFormSchema>;

interface TodoEditPageProps {
  todoId: string;
}

export function TodoEditPage({ todoId }: TodoEditPageProps) {
  const router = useRouter();
  const { setHeader } = useHeader();

  const { todo, isLoading, isError } = useTodoDetail(todoId);
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();

  const form = useForm<EditTodoFormData>({
    resolver: zodResolver(editTodoFormSchema),
    defaultValues: {
      text: '',
      priority: 'medium',
    },
  });

  useEffect(() => {
    if (!todo) return;

    form.reset({
      text: todo.text,
      priority: todo.priority || 'medium',
    });

    setHeader({
      title: `Edit: ${todo.text}`,
      breadcrumbs: [
        { href: ROUTES.TODOS, label: 'Todos' },
        { href: ROUTES.TODO_DETAIL(todo.id), label: 'Todo' },
        { href: ROUTES.TODO_EDIT(todo.id), label: 'Edit' },
      ],
    });
  }, [form, setHeader, todo]);

  const onSubmit = async (data: EditTodoFormData) => {
    if (!todo) return;

    try {
      await updateTodo({
        id: todo.id,
        text: data.text,
        priority: data.priority,
      }).unwrap();

      handleApiSuccess('Todo updated successfully');
      router.push(ROUTES.TODO_DETAIL(todo.id));
    } catch (error: unknown) {
      handleZodError<void>(error, {
        onZodError: (fieldErrors) => {
          for (const [field, message] of Object.entries(fieldErrors)) {
            if (field === '_form') {
              form.setError('text', { type: 'manual', message });
              continue;
            }

            form.setError(field as keyof EditTodoFormData, { type: 'manual', message });
          }
        },
        onOtherError: (err) => {
          handleApiError(err as FetchBaseQueryError, 'Failed to update todo');
        },
      });
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading todo..." />;
  }

  if (isError || !todo) {
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
        <Button
          variant="ghost"
          onClick={() => router.push(ROUTES.TODO_DETAIL(todo.id))}
          className="mb-4"
          disabled={isUpdating}
        >
          ← Back to Todo
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Todo</h1>
        <p className="text-gray-600 mt-2">Update your task details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Todo text" disabled={isUpdating} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <select
                        className="rounded-lg border border-gray-300 px-3 py-2 w-full"
                        disabled={isUpdating}
                        {...field}
                      >
                        <option value="low">{TODO_PRIORITY_LABELS.low}</option>
                        <option value="medium">{TODO_PRIORITY_LABELS.medium}</option>
                        <option value="high">{TODO_PRIORITY_LABELS.high}</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isUpdating}
                  onClick={() => router.push(ROUTES.TODO_DETAIL(todo.id))}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating} isLoading={isUpdating}>
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
