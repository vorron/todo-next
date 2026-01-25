/**
 * Workspace API
 * RTK Query API для workspace сущности
 */

import { baseApi } from '@/shared/api';

import { buildWorkspaceCrudEndpoints } from './workspace-api-crud';

export const workspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...buildWorkspaceCrudEndpoints(builder),
  }),
});

// Export API definition
export const {
  endpoints: workspaceApiEndpoints,
  util: workspaceApiUtil,
  reducerPath: workspaceApiReducerPath,
  reducer: workspaceApiReducer,
  middleware: workspaceApiMiddleware,
} = workspaceApi;
