import { baseApi } from '@/shared/api';

export const workspaceApi = baseApi.injectEndpoints({
  endpoints: (_builder) => ({
    //getWorkspace: builder.query<Workspace, void>({}), // Текущий workspace
    // updateWorkspace: builder.mutation<Workspace, Partial<Workspace>>({...}),
  }),
});
