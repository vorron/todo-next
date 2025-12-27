import { baseApi } from '@/shared/api';

import { buildTodoBulkEndpoints } from './todo-api-bulk';
import { buildTodoCrudEndpoints } from './todo-api-crud';

export const todoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...buildTodoCrudEndpoints(builder),
    ...buildTodoBulkEndpoints(builder),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoMutation,
  useClearCompletedMutation,
} = todoApi;
