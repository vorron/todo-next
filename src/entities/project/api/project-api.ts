import { baseApi } from '@/shared/api';

import { buildProjectCrudEndpoints } from './project-api-crud';

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...buildProjectCrudEndpoints(builder),
  }),
});

// Export only API definitions (no hooks!)
export const {
  endpoints: projectApiEndpoints,
  util: projectApiUtil,
  reducerPath: projectApiReducerPath,
  reducer: projectApiReducer,
  middleware: projectApiMiddleware,
} = projectApi;
