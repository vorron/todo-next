'use client';

import { useCallback } from 'react';

import { type Project } from '@/entities/project';
import {
  type CreateProjectFormData,
  type EditProjectFormData,
} from '@/entities/project/model/project-form-schemas';

// Временно - эмуляция API, в реальном приложении здесь будут RTK Query хуки
export interface UseProjectApiResult {
  project: Project | undefined;
  isLoading: boolean;
  error: unknown;
  submit: (data: CreateProjectFormData | EditProjectFormData) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * API слой для формы проекта
 * Отвечает только за сетевые запросы: загрузку данных и сабмит
 */
export const useProjectApi = (): UseProjectApiResult => {
  // Временно - эмуляция загрузки
  const isLoading = false;
  const error = null;
  const project = undefined;
  const isSubmitting = false;

  const submit = useCallback(async (data: CreateProjectFormData | EditProjectFormData) => {
    try {
      console.log('Creating/updating project:', data);

      // Временно - эмуляция API вызова
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // В реальном приложении здесь будет:
      // - Для создания: useCreateProject().mutateAsync(data)
      // - Для обновления: useUpdateProject().mutateAsync({ id, data })

      console.log('Project created/updated successfully');
    } catch (error) {
      console.error('Failed to create/update project:', error);
      throw error;
    }
  }, []);

  return {
    project,
    isLoading,
    error,
    submit,
    isSubmitting,
  };
};
