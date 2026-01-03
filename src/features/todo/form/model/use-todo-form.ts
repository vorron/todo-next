'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  createTodoFormSchema,
  editTodoFormSchema,
  type CreateTodoFormData,
  type EditTodoFormData,
  formatTagsForInput,
  toDateInputValue,
} from '@/entities/todo/model/todo-form-schemas';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import { ROUTES } from '@/shared/lib/router';
import { handleZodError } from '@/shared/lib/utils';

import { useTodoFormApi } from '../api/todo-form-api';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export interface UseTodoFormProps {
  mode: 'create' | 'edit';
  todoId?: string;
}

export type TodoFormData = CreateTodoFormData | EditTodoFormData;

/**
 * Logic слой для формы todo
 * Отвечает за валидацию, состояние формы и обработку сабмита
 */
export const useTodoForm = ({ mode, todoId }: UseTodoFormProps) => {
  const router = useRouter();

  // API слой
  const { todo, isLoading, error, submit, isSubmitting } = useTodoFormApi({ mode, todoId });

  // Выбор схемы в зависимости от режима
  const schema = mode === 'create' ? createTodoFormSchema : editTodoFormSchema;

  // Настройка формы
  const form = useForm<TodoFormData>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(mode),
  });

  // Установка значений при загрузке данных для режима редактирования
  useEffect(() => {
    if (mode === 'edit' && todo) {
      form.reset({
        text: todo.text,
        priority: todo.priority || 'medium',
        dueDate: toDateInputValue(todo.dueDate),
        tagsInput: formatTagsForInput(todo.tags),
      });
    }
  }, [form, mode, todo]);

  // Обработчик сабмита формы
  const onSubmit = async (data: TodoFormData) => {
    try {
      await submit(data);

      // Действия после успешного сабмита
      if (mode === 'create') {
        form.reset();
        handleApiSuccess('Todo created successfully');
      } else {
        handleApiSuccess('Todo updated successfully');
        if (ROUTES.TODO_DETAIL) {
          router.push(ROUTES.TODO_DETAIL(todoId!));
        }
      }
    } catch (error: unknown) {
      handleZodError<void>(error, {
        onZodError: (fieldErrors) => {
          for (const [field, message] of Object.entries(fieldErrors)) {
            if (field === '_form') {
              form.setError('text' as keyof TodoFormData, { type: 'manual', message });
              continue;
            }

            form.setError(field as keyof TodoFormData, { type: 'manual', message });
          }
        },
        onOtherError: (err) => {
          handleApiError(err as FetchBaseQueryError, `Failed to ${mode} todo`);
        },
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    isSubmitting,
    todo,
  };
};

/**
 * Значения по умолчанию для формы в зависимости от режима
 */
function getDefaultValues(mode: 'create' | 'edit'): TodoFormData {
  if (mode === 'create') {
    return {
      text: '',
    } as CreateTodoFormData;
  }

  return {
    text: '',
    priority: 'medium',
    dueDate: '',
    tagsInput: '',
  } as EditTodoFormData;
}
