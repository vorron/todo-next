/**
 * Create Workspace Mutation Hook
 * RTK Query мутация для создания workspace
 */

import { useCallback } from 'react';

import { workspaceApi } from '@/entities/workspace/api/workspace-api';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';

import type { Workspace } from '@/entities/workspace/model/schema';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useCreateWorkspace() {
  const [createMutation, { isLoading: isCreating }] =
    workspaceApi.endpoints.createWorkspace.useMutation();

  const createWorkspace = useCallback(
    async (data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const result = await createMutation(data).unwrap();

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
