'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useCreateTimeEntry } from './mutations/use-create-time-entry';
import {
  timeEntryFormSchema,
  type TimeEntryFormData,
  getDefaultTimeEntryFormValues,
  calculateEndTime,
} from './time-entry-form-schemas';

export interface UseTimeEntryFormProps {
  _workspaceId: string;
  userId: string;
  onSuccess?: (data: TimeEntryFormData) => void;
}

/**
 * Logic слой для формы time entry
 * Отвечает за валидацию, состояние формы и обработку сабмита
 */
export function useTimeEntryForm({ _workspaceId, userId, onSuccess }: UseTimeEntryFormProps) {
  const { createTimeEntry, isCreating } = useCreateTimeEntry();

  const form = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntryFormSchema),
    defaultValues: getDefaultTimeEntryFormValues(),
    mode: 'onBlur',
  });

  // Устанавливаем userId при изменении
  useEffect(() => {
    if (userId) {
      form.setValue('userId', userId);
    }
  }, [userId, form]);

  // Вычисление endTime при изменении startTime или duration
  const startTime = form.watch('startTime');
  const duration = form.watch('duration');

  useEffect(() => {
    if (startTime && duration) {
      const endTime = calculateEndTime(startTime, duration);
      form.setValue('endTime', endTime);
    }
  }, [startTime, duration, form]);

  const onSubmit = async (data: TimeEntryFormData) => {
    try {
      const result = await createTimeEntry({
        ...data,
        userId,
        workspaceId: _workspaceId,
      });

      onSuccess?.(data);
      form.reset();
      form.setValue('userId', userId);

      return result;
    } catch (error) {
      // Обработка ошибок валидации
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = error.data as Record<string, string>;

        for (const [field, message] of Object.entries(errorData)) {
          form.setError(field as keyof TimeEntryFormData, { type: 'manual', message });
        }
      }

      throw error;
    }
  };

  // Обработчик быстрого добавления (когда все поля заполнены)
  const handleQuickAdd = () => {
    const currentValues = form.getValues();

    // Проверяем, заполнены ли обязательные поля
    if (
      currentValues.description &&
      currentValues.projectId &&
      currentValues.date &&
      currentValues.startTime
    ) {
      // Если все заполнено - создаем запись мгновенно
      form.handleSubmit(onSubmit)();
    } else {
      // Если не все заполнены - открываем диалог (будет реализовано позже)
      console.log('Open dialog for detailed entry');
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    handleQuickAdd,
    isSubmitting: isCreating,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    dirtyFields: form.formState.dirtyFields,
  };
}
