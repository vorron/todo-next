import { z } from 'zod';

import type { CreateProject, UpdateProject } from '../model/schema';

/**
 * Схема для создания проекта через API
 */
export const createProjectApiSchema = z.object({
  name: z.string().min(1, 'Название проекта обязательно').max(100),
  description: z.string().max(1000).nullable().optional(),
  config: z.any().nullable().optional(),
  isActive: z.boolean(),
  workspaceId: z.string().min(1, 'Workspace ID обязателен'),
});

/**
 * Схема для обновления проекта через API
 */
export const updateProjectApiSchema = z.object({
  name: z.string().min(1, 'Название проекта обязательно').max(100).optional(),
  description: z.string().max(1000).nullable().optional(),
  config: z.any().nullable().optional(),
  isActive: z.boolean().optional(),
});

/**
 * Типы для API
 */
export type CreateProjectApiData = z.infer<typeof createProjectApiSchema>;
export type UpdateProjectApiData = z.infer<typeof updateProjectApiSchema>;

/**
 * Преобразование данных формы в данные API
 */
export const transformCreateProjectData = (data: CreateProject): CreateProjectApiData => ({
  name: data.name,
  description: data.description,
  config: data.config,
  isActive: data.isActive,
  workspaceId: data.workspaceId || '',
});

/**
 * Преобразование данных обновления в данные API
 */
export const transformUpdateProjectData = (data: UpdateProject): UpdateProjectApiData => {
  const result: UpdateProjectApiData = {};

  if (data.name !== undefined) result.name = data.name;
  if (data.description !== undefined) result.description = data.description;
  if (data.config !== undefined) result.config = data.config;
  if (data.isActive !== undefined) result.isActive = data.isActive;

  return result;
};
