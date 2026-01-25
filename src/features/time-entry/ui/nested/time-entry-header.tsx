'use client';

import { useState } from 'react';

import { type Workspace } from '@/entities/workspace';
import { useAuth } from '@/features/auth';
import { Form } from '@/shared/ui/form';

import { useTimeEntryForm } from '../../model/use-time-entry-form';
import { TimeEntryDialog } from '../../ui/time-entry-dialog';
import { TimeEntryFormFields } from '../../ui/time-entry-form-fields';

import type { TimeEntryFormData } from '../../model/time-entry-form-schemas';

export interface TimeEntryHeaderProps {
  workspace: Workspace;
}

export function TimeEntryHeader({ workspace }: TimeEntryHeaderProps) {
  // Получаем userId из auth context
  const { user } = useAuth();
  const userId = user?.id;

  // Состояние диалога
  const [dialogOpen, setDialogOpen] = useState(false);

  const { form, onSubmit, isSubmitting } = useTimeEntryForm({
    _workspaceId: workspace.id,
    userId: userId || '', // Передаем пустую строку если нет userId
    onSuccess: (data: TimeEntryFormData) => {
      console.log('Time entry created:', data);
      setDialogOpen(false);

      // TODO: Обновить список time entries через RTK Query cache invalidation
      // Это будет реализовано когда создадим API для time entries
    },
  });

  // Если пользователь не авторизован, не показываем форму
  if (!userId) {
    return (
      <div className="p-4 border-b bg-white">
        <div className="text-center text-muted-foreground">
          Пожалуйста, войдите в систему для добавления записей о времени
        </div>
      </div>
    );
  }

  // Обработчик кнопки "Добавить"
  const handleAddClick = () => {
    const currentValues = form.getValues();

    // Проверяем, заполнены ли обязательные поля
    if (
      currentValues.description &&
      currentValues.projectId &&
      currentValues.date &&
      currentValues.startTime &&
      currentValues.duration
    ) {
      // Если все заполнено - создаем запись мгновенно
      onSubmit();
    } else {
      // Если не все заполнены - открываем диалог
      setDialogOpen(true);
    }
  };

  // Обработчик сабмита в диалоге
  const handleDialogSubmit = () => {
    onSubmit();
  };

  // Обработчик отмены в диалоге
  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <div className="p-4 border-b bg-white">
        <Form {...form}>
          <div className="w-full">
            <div className="flex gap-2 items-center">
              {/* Поля формы без кнопки */}
              <TimeEntryFormFields
                control={form.control}
                disabled={isSubmitting}
                showSubmitButton={false}
              />

              {/* Кнопка "Добавить" с умной логикой */}
              <button
                type="button"
                onClick={handleAddClick}
                disabled={isSubmitting}
                className="shrink-0 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                {isSubmitting ? 'Создание...' : 'Добавить'}
              </button>
            </div>
          </div>
        </Form>
      </div>

      {/* Диалог для детального ввода */}
      <TimeEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        control={form.control}
        onSubmit={handleDialogSubmit}
        onCancel={handleDialogCancel}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
