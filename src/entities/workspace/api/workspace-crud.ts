/**
 * Workspace CRUD Endpoints
 * RTK Query эндпоинты для workspace по аналогии с todo
 */

import { createValidatedEndpoint, createEntityTags } from '@/shared/api';

import {
  workspaceSсhema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceUserSchema,
} from '../model/schema';

import type { Workspace, WorkspaceUser } from '../model/schema';
import type { BaseApiEndpointBuilder } from '@/shared/api';

const workspaceTags = createEntityTags('Workspace');

export function buildWorkspaceCrudEndpoints(builder: BaseApiEndpointBuilder) {
  return {
    // Получение списка workspaces
    getWorkspaces: builder.query<Workspace[], void>({
      query: () => 'workspaces',
      providesTags: workspaceTags.provideListTags,
      ...createValidatedEndpoint(workspaceSсhema.array()),
    }),

    // Получение одного workspace по ID
    getWorkspaceById: builder.query<Workspace, string>({
      query: (id) => `workspaces/${id}`,
      providesTags: (result, error, id) => [{ type: 'Workspace', id }],
      ...createValidatedEndpoint(workspaceSсhema),
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
        ...createValidatedEndpoint(workspaceSсhema),
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
      ...createValidatedEndpoint(workspaceSсhema),
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

    // Получение пользователей workspace
    getWorkspaceUsers: builder.query<WorkspaceUser[], string>({
      query: (workspaceId) => `workspaceUsers?workspaceId=${workspaceId}`,
      providesTags: (result, _error, _workspaceId) =>
        result
          ? result.map((user: WorkspaceUser) => ({
              type: 'Workspace' as const,
              id: user.workspaceId,
            }))
          : [],
      ...createValidatedEndpoint(workspaceUserSchema.array()),
    }),
  } as const;
}
