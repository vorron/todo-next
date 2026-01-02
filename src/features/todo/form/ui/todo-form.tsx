'use client';

import { Card, CardContent, Form, Button } from '@/shared/ui';

import { TodoFormFields } from './todo-form-fields';
import { useTodoForm } from '../model/use-todo-form';

export interface TodoFormProps {
  mode: 'create' | 'edit';
  todoId?: string;
}

/**
 * View слой унифицированной формы todo
 * Отвечает только за рендер UI, без бизнес-логики
 */
export const TodoForm = ({ mode, todoId }: TodoFormProps) => {
  const { form, onSubmit, isLoading, error, isSubmitting } = useTodoForm({ mode, todoId });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error && mode === 'edit') {
    return (
      <div className="text-red-600 p-4">
        Error loading todo:{' '}
        {typeof error === 'object' && error && 'message' in error
          ? String(error.message)
          : 'Unknown error'}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className={mode === 'create' ? 'flex gap-2 items-start' : 'space-y-4'}
          >
            <TodoFormFields mode={mode} control={form.control} disabled={isSubmitting} />

            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className={mode === 'create' ? '' : 'w-full'}
            >
              {mode === 'create' ? 'Add' : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
