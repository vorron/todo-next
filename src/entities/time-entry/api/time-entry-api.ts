/**
 * Time Entry API
 * RTK Query API для time entry сущности
 */

import { baseApi } from '@/shared/api';

import { buildTimeEntryCrudEndpoints } from './time-entry-api-crud';

export const timeEntryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...buildTimeEntryCrudEndpoints(builder),
  }),
});

// Export API definition
export const {
  endpoints: timeEntryApiEndpoints,
  util: timeEntryApiUtil,
  reducerPath: timeEntryApiReducerPath,
  reducer: timeEntryApiReducer,
  middleware: timeEntryApiMiddleware,
} = timeEntryApi;
