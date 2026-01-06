/**
 * Delete Workspace Mutation Hook
 * RTK Query мутация для удаления workspace
 */

import { useCallback } from 'react';

import { workspaceApi } from '@/entities/workspace/api/workspace-api';
import { handleApiError, handleApiSuccess } from '@/shared/lib/errors';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function useDeleteWorkspace() {
  const [deleteMutation, { isLoading: isDeleting }] =
    workspaceApi.endpoints.deleteWorkspace.useMutation();

  const deleteWorkspace = useCallback(
    async (id: string) => {
      try {
        await deleteMutation(id).unwrap();

        handleApiSuccess('Workspace deleted successfully');
      } catch (error) {
        handleApiError(error as FetchBaseQueryError, 'Failed to delete workspace');
        throw error;
      }
    },
    [deleteMutation],
  );

  return {
    deleteWorkspace,
    isDeleting,
  };
}
