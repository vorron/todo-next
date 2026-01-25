'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  createProjectFormSchema,
  type CreateProjectFormData,
  getDefaultCreateProjectValues,
} from '@/entities/project/model/project-form-schemas';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';
import { handleZodError } from '@/shared/lib/utils';

import { useCreateProject } from './mutations/use-create-project';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export interface UseProjectFormProps {
  workspaceId: string;
  onSuccess?: (data: CreateProjectFormData) => void;
}

/**
 * Logic слой для формы проекта
 * Отвечает за валидацию, состояние формы и обработку сабмита
 */
export const useProjectForm = ({ workspaceId, onSuccess }: UseProjectFormProps) => {
  // API слой
  const { createProject, isCreating } = useCreateProject();

  // Настройка формы
  const form = useForm({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: getDefaultCreateProjectValues(workspaceId),
    mode: 'onBlur',
  } as const);

  // Установка workspaceId при монтировании
  useEffect(() => {
    form.setValue('workspaceId', workspaceId);
  }, [form, workspaceId]);

  // Обработчик сабмита формы
  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      await createProject(data);

      // Действия после успешного сабмита
      handleApiSuccess('Project created successfully');

      // Сброс формы
      form.reset(getDefaultCreateProjectValues(workspaceId));

      // Callback для родительского компонента
      onSuccess?.(data);
    } catch (error: unknown) {
      handleZodError<void>(error, {
        onZodError: (fieldErrors) => {
          for (const [field, message] of Object.entries(fieldErrors)) {
            if (field === '_form') {
              form.setError('name', { type: 'manual', message });
              continue;
            }

            form.setError(field as keyof CreateProjectFormData, { type: 'manual', message });
          }
        },
        onOtherError: (err) => {
          handleApiError(err as FetchBaseQueryError, 'Failed to create project');
        },
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: isCreating,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    dirtyFields: form.formState.dirtyFields,
  };
};
