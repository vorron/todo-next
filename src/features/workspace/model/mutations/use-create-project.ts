import { useCallback } from 'react';

import { projectApi } from '@/entities/project';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useCreateProject() {
  const [createMutation, { isLoading: isCreating }] =
    projectApi.endpoints.createProject.useMutation();

  const createProject = useCallback(
    async (data: {
      name: string;
      description?: string | null;
      config?: unknown;
      isActive: boolean;
      workspaceId: string;
    }) => {
      try {
        const projectData = {
          name: data.name.trim(),
          description: data.description || null,
          config: data.config || null,
          isActive: data.isActive,
          workspaceId: data.workspaceId,
        };

        await createMutation(projectData).unwrap();

        handleApiSuccess('Project created successfully');
      } catch (error) {
        handleApiError(error as FetchBaseQueryError, 'Failed to create project');
        throw error;
      }
    },
    [createMutation],
  );

  return {
    createProject,
    isCreating,
  };
}
