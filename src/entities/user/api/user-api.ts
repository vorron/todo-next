import { baseApi, createValidatedEndpoint, createEntityTags } from '@/shared/api';

import { userSchema, usersSchema, createUserSchema, updateUserSchema } from '../model/user-schema';

import type { User, CreateUserDto, UpdateUserDto } from '../model/types';

const userTags = createEntityTags('User');

/**
 * API endpoints для работы с пользователями
 */
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Получение всех пользователей
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: userTags.provideListTags,
      ...createValidatedEndpoint(usersSchema),
    }),

    // Получение пользователя по ID
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
      ...createValidatedEndpoint(userSchema),
    }),

    // Создание пользователя
    createUser: builder.mutation<User, CreateUserDto>({
      query: (data) => {
        const validatedData = createUserSchema.parse(data);
        return {
          url: 'users',
          method: 'POST',
          body: validatedData,
        };
      },
      invalidatesTags: userTags.invalidateListTags,
      ...createValidatedEndpoint(userSchema),
    }),

    // Обновление пользователя
    updateUser: builder.mutation<User, UpdateUserDto>({
      query: ({ id, ...data }) => {
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
      ...createValidatedEndpoint(userSchema),
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
