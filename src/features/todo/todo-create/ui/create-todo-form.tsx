'use client';

import { useState } from 'react';
import { Button, Input, Card, CardContent } from '@/shared/ui';
import { useCreateTodo } from '../model/use-create-todo';

export function CreateTodoForm() {
  const [text, setText] = useState('');
  const { create, isLoading, errors, clearErrors } = useCreateTodo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await create(text);

    if (result.success) {
      setText('');
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (errors.text) clearErrors();
              }}
              placeholder="What needs to be done?"
              error={errors.text}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={!text.trim() || isLoading} isLoading={isLoading}>
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
