import { z } from 'zod';

/**
 * Схема формы создания проекта
 * Создана с нуля для UI-специфичных валидаций, но использует типы из shared-schemas
 */
export const createProjectFormSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace ID обязателен'),

  name: z.string().min(1, 'Название проекта обязательно').max(100, 'Максимум 100 символов').trim(),

  description: z.string().max(1000, 'Максимум 1000 символов').trim().nullable().optional(),

  config: z.any().nullable().optional(),

  isActive: z.boolean(),
});

/**
 * Схема формы редактирования проекта
 */
export const editProjectFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Название проекта обязательно')
    .max(100, 'Максимум 100 символов')
    .trim()
    .optional(),

  description: z.string().max(1000, 'Максимум 1000 символов').trim().nullable().optional(),

  config: z.any().nullable().optional(),

  isActive: z.boolean().optional(),
});

/**
 * Типы для форм
 */
export type CreateProjectFormData = z.infer<typeof createProjectFormSchema>;
export type EditProjectFormData = z.infer<typeof editProjectFormSchema>;

/**
 * Значения по умолчанию для формы создания
 */
export const getDefaultCreateProjectValues = (workspaceId: string): CreateProjectFormData => ({
  workspaceId,
  name: '',
  description: null,
  config: null,
  isActive: true,
});

/**
 * Значения по умолчанию для формы редактирования
 */
export const getDefaultEditProjectValues = (): EditProjectFormData => ({
  name: '',
  description: null,
  config: null,
  isActive: true,
});
