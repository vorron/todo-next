import { useCallback } from 'react';

import { workspaceApi } from '@/entities/workspace';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';

import type { Workspace } from '@/entities/workspace/model/schema';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useCreateWorkspace() {
  const [createMutation, { isLoading: isCreating }] =
    workspaceApi.endpoints.createWorkspace.useMutation();

  const createWorkspace = useCallback(
    async (data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt' | 'isDefault'>) => {
      try {
        // Добавляем isDefault со значением false по умолчанию
        const workspaceData = {
          ...data,
          isDefault: false,
        };
        const result = await createMutation(workspaceData).unwrap();

        handleApiSuccess('Workspace created successfully');
        return result;
      } catch (error) {
        handleApiError(error as FetchBaseQueryError, 'Failed to create workspace');
        throw error;
      }
    },
    [createMutation],
  );

  return {
    createWorkspace,
    isCreating,
  };
}
