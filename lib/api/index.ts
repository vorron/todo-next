import { authEndpoints } from './authApi';
import { api } from './baseApi';
import { todoEndpoints } from './todosApi';


// Инжектим все endpoints в основной API
export const enhancedApi = api.injectEndpoints({
  endpoints: (build) => ({
    ...todoEndpoints(build),
    ...authEndpoints(build),
  }),
});

// Экспортируем все хуки из объединенного API
export const {
  // Todo hooks
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useToggleAllTodosMutation,
  useClearCompletedMutation,
  
  // Auth hooks
  useGetUsersQuery,
  useGetCurrentUserQuery,
  useCreateUserMutation,
} = enhancedApi;

// Экспортируем API для store
export { enhancedApi as api };

// Экспортируем типы
export type { Todo, User, FilterType } from '@/types';