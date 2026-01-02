import { baseApi } from '@/shared/api';

import { buildTodoBulkEndpoints } from './todo-api-bulk';
import { buildTodoCrudEndpoints } from './todo-api-crud';

export const todoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...buildTodoCrudEndpoints(builder),
    ...buildTodoBulkEndpoints(builder),
  }),
});

// Export only API definitions (no hooks!)
export const {
  endpoints: todoApiEndpoints,
  util: todoApiUtil,
  reducerPath: todoApiReducerPath,
  reducer: todoApiReducer,
  middleware: todoApiMiddleware,
} = todoApi;
