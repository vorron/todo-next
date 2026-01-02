'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createTodoFormSchema, type CreateTodoFormData } from '@/entities/todo';
import { useCreateTodo } from '@/features/todo/model';
import { Button, Card, CardContent } from '@/shared/ui';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input-primitive';

export function CreateTodoForm() {
  const { createTodo, isCreating } = useCreateTodo();

  const form = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoFormSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = async (data: CreateTodoFormData) => {
    try {
      await createTodo({
        text: data.text,
      });
      form.reset();
    } catch {
      // Error handling is done in the hook
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-start">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      id="create-todo-input"
                      placeholder="What needs to be done?"
                      disabled={isCreating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isCreating} isLoading={isCreating}>
              Add
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
