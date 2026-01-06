/**
 * Update Workspace Mutation Hook
 * RTK Query мутация для обновления workspace
 */

import { useCallback } from 'react';

import { workspaceApi } from '@/entities/workspace/api/workspace-api';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';

import type { Workspace } from '@/entities/workspace/model/schema';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useUpdateWorkspace() {
  const [updateMutation, { isLoading: isUpdating }] =
    workspaceApi.endpoints.updateWorkspace.useMutation();

  const updateWorkspace = useCallback(
    async (id: string, updates: Partial<Workspace>) => {
      try {
        const result = await updateMutation({ id, updates }).unwrap();

        handleApiSuccess('Workspace updated successfully');
        return result;
      } catch (error) {
        handleApiError(error as FetchBaseQueryError, 'Failed to update workspace');
        throw error;
      }
    },
    [updateMutation],
  );

  return {
    updateWorkspace,
    isUpdating,
  };
}
