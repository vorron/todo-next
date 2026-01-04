import { baseApi, createValidatedEndpoint } from '@/shared/api';

import { Workspace } from '../model/schema';

export const workspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //getWorkspace: builder.query<Workspace, void>({}), // Текущий workspace
    // updateWorkspace: builder.mutation<Workspace, Partial<Workspace>>({...}),
  }),
});
