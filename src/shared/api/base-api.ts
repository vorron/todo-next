import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithLogging } from './base-query';

/**
 * Базовый API с тэгами для cache invalidation
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogging,
  tagTypes: ['Todo', 'User', 'Auth'],
  endpoints: () => ({}),
});
