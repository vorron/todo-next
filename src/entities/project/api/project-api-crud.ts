/**
 * Project CRUD Endpoints
 * RTK Query эндпоинты для project с улучшенными паттернами
 */

import { createValidatedEndpoint, createEntityTags } from '@/shared/api';

import { projectSchema, createProjectSchema, updateProjectSchema } from '../model/schema';

import type { Project } from '../model/schema';
import type { BaseApiEndpointBuilder } from '@/shared/api';

const projectTags = createEntityTags('Project');

export function buildProjectCrudEndpoints(builder: BaseApiEndpointBuilder) {
  return {
    // Получение списка проектов
    getProjects: builder.query<Project[], void>({
      query: () => 'projects',
      providesTags: projectTags.provideListTags,
      ...createValidatedEndpoint(projectSchema.array()),
    }),

    // Получение одного проекта по ID
    getProjectById: builder.query<Project, string>({
      query: (id) => `projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
      ...createValidatedEndpoint(projectSchema),
    }),

    // Создание проекта
    createProject: builder.mutation<Project, Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (data) => {
        const validatedData = createProjectSchema.parse(data);

        return {
          url: 'projects',
          method: 'POST',
          body: validatedData,
        };
      },
      invalidatesTags: projectTags.invalidateListTags,
      ...createValidatedEndpoint(projectSchema),
    }),

    // Обновление проекта
    updateProject: builder.mutation<Project, { id: string; updates: Partial<Project> }>({
      query: ({ id, ...data }) => {
        const validatedData = updateProjectSchema.parse({ id, ...data });

        return {
          url: `projects/${id}`,
          method: 'PATCH',
          body: validatedData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
      ...createValidatedEndpoint(projectSchema),
    }),

    // Удаление проекта
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
    }),
  } as const;
}
