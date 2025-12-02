import { baseApi } from '@/shared/api';
import { userSchema, usersSchema, createUserSchema, updateUserSchema } from '../model/user-schema';
import type { User, CreateUserDto, UpdateUserDto } from '../model/types';

/**
 * API endpoints для работы с пользователями
 */
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Получение всех пользователей
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
      transformResponse: (response: unknown) => {
        return usersSchema.parse(response);
      },
    }),

    // Получение пользователя по ID
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
      transformResponse: (response: unknown) => {
        return userSchema.parse(response);
      },
    }),

    // Создание пользователя
    createUser: builder.mutation<User, CreateUserDto>({
      query: (data) => {
        // Валидируем данные перед отправкой
        const validatedData = createUserSchema.parse(data);

        return {
          url: 'users',
          method: 'POST',
          body: validatedData,
        };
      },
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
      transformResponse: (response: unknown) => {
        return userSchema.parse(response);
      },
    }),

    // Обновление пользователя
    updateUser: builder.mutation<User, UpdateUserDto>({
      query: ({ id, ...data }) => {
        // Валидируем данные
        const validatedData = updateUserSchema.parse({ id, ...data });

        return {
          url: `users/${id}`,
          method: 'PATCH',
          body: validatedData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
      transformResponse: (response: unknown) => {
        return userSchema.parse(response);
      },
    }),

    // Удаление пользователя
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
