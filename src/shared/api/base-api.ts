import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithLogging } from './base-query';

/**
 * Базовый API с тэгами для cache invalidation
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogging,
  tagTypes: ['Todo', 'User', 'Auth', 'Workspace', 'TimeEntry', 'WorkspaceUser', 'Project'],
  endpoints: () => ({}),
});

export type BaseApiEndpointsFactory = Parameters<typeof baseApi.injectEndpoints>[0]['endpoints'];

export type BaseApiEndpointBuilder = Parameters<BaseApiEndpointsFactory>[0];
