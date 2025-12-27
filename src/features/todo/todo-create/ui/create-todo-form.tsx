'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Card, CardContent } from '@/shared/ui';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input-primitive';

import { createTodoFormSchema, type CreateTodoFormData } from '../model/create-todo-schema';
import { useCreateTodo } from '../model/use-create-todo';

export function CreateTodoForm() {
  const { create, isLoading } = useCreateTodo();

  const form = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoFormSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = async (data: CreateTodoFormData) => {
    const result = await create(data.text.trim());

    if (result.success) {
      form.reset();
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
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} isLoading={isLoading}>
              Add
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
