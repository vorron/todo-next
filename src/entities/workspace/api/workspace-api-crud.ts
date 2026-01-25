/**
 * Workspace CRUD Endpoints
 * RTK Query эндпоинты для workspace с улучшенными паттернами
 */

import { createValidatedEndpoint, createEntityTags } from '@/shared/api';

import { workspaceSchema, createWorkspaceSchema, updateWorkspaceSchema } from '../model/schema';

import type { Workspace } from '../model/schema';
import type { BaseApiEndpointBuilder } from '@/shared/api';

const workspaceTags = createEntityTags('Workspace');

export function buildWorkspaceCrudEndpoints(builder: BaseApiEndpointBuilder) {
  return {
    // Получение списка workspaces
    getWorkspaces: builder.query<Workspace[], void>({
      query: () => 'workspaces',
      providesTags: workspaceTags.provideListTags,
      ...createValidatedEndpoint(workspaceSchema.array()),
    }),

    // Получение workspaces по ownerId
    getWorkspacesByOwner: builder.query<Workspace[], string>({
      query: (ownerId) => `workspaces?ownerId=${ownerId}`,
      providesTags: workspaceTags.provideListTags,
      ...createValidatedEndpoint(workspaceSchema.array()),
    }),

    // Получение одного workspace по ID
    getWorkspaceById: builder.query<Workspace, string>({
      query: (id) => `workspaces/${id}`,
      providesTags: (result, error, id) => [{ type: 'Workspace', id }],
      ...createValidatedEndpoint(workspaceSchema),
    }),

    // Создание workspace
    createWorkspace: builder.mutation<Workspace, Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>>(
      {
        query: (data) => {
          const validatedData = createWorkspaceSchema.parse(data);

          return {
            url: 'workspaces',
            method: 'POST',
            body: validatedData,
          };
        },
        invalidatesTags: workspaceTags.invalidateListTags,
        ...createValidatedEndpoint(workspaceSchema),
      },
    ),

    // Обновление workspace
    updateWorkspace: builder.mutation<Workspace, { id: string; updates: Partial<Workspace> }>({
      query: ({ id, ...data }) => {
        const validatedData = updateWorkspaceSchema.parse({ id, ...data });

        return {
          url: `workspaces/${id}`,
          method: 'PATCH',
          body: validatedData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Workspace', id },
        { type: 'Workspace', id: 'LIST' },
      ],
      ...createValidatedEndpoint(workspaceSchema),
    }),

    // Удаление workspace
    deleteWorkspace: builder.mutation<void, string>({
      query: (id) => ({
        url: `workspaces/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Workspace', id },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),
  } as const;
}
