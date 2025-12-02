import { baseApi } from '@/shared/api';
import { buildTodoCrudEndpoints } from './todo-api-crud';
import { buildTodoBulkEndpoints } from './todo-api-bulk';

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
  useToggleAllTodosMutation,
  useClearCompletedMutation,
} = todoApi;
