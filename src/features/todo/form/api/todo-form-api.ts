'use client';

import { useCallback } from 'react';

import { parseTagsInput } from '@/entities/todo/model/todo-form-schemas';
import {
  type CreateTodoFormData,
  type EditTodoFormData,
} from '@/entities/todo/model/todo-form-schemas';
import { useTodoById, useCreateTodo, useUpdateTodo } from '@/features/todo/model';

import type { Todo } from '@/entities/todo';

export interface UseTodoFormApiProps {
  mode: 'create' | 'edit';
  todoId?: string;
}

export interface TodoFormApiResult {
  todo: Todo | undefined;
  isLoading: boolean;
  error: unknown;
  submit: (data: CreateTodoFormData | EditTodoFormData) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * API слой для формы todo
 * Отвечает только за сетевые запросы: загрузку данных и сабмит
 */
export const useTodoFormApi = ({ mode, todoId }: UseTodoFormApiProps): TodoFormApiResult => {
  // Для режима редактирования загружаем существующие данные
  const shouldLoadTodo = mode === 'edit' && todoId;
  const { todo, isLoading, error } = useTodoById(shouldLoadTodo ? todoId : 'skip');

  // Мутации для создания и обновления
  const { createTodo, isCreating } = useCreateTodo();
  const { updateTodo, isUpdating } = useUpdateTodo();

  const submit = useCallback(
    async (data: CreateTodoFormData | EditTodoFormData) => {
      if (mode === 'create') {
        const createData = data as CreateTodoFormData;
        await createTodo({
          text: createData.text,
        });
      } else if (mode === 'edit' && todo) {
        const editData = data as EditTodoFormData;
        const tags = parseTagsInput(editData.tagsInput);

        await updateTodo({
          ...todo,
          text: editData.text,
          priority: editData.priority,
          dueDate: editData.dueDate || undefined,
          tags,
        });
      }
    },
    [mode, todo, createTodo, updateTodo],
  );

  return {
    todo: shouldLoadTodo ? todo : undefined,
    isLoading: shouldLoadTodo ? isLoading : false,
    error: shouldLoadTodo ? error : undefined,
    submit,
    isSubmitting: mode === 'create' ? isCreating : isUpdating,
  };
};
