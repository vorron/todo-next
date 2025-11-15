// lib/api/auth/authApi.ts
import { User } from '@/types';
import type { AppBuilder } from '@/types';

export const authEndpoints = (builder: AppBuilder) => ({
  // Получение всех пользователей
  getUsers: builder.query<User[], void>({
    query: () => 'users',
    providesTags: [{ type: 'User', id: 'LIST' }],
  }),

  // Получение конкретного пользователя
  getCurrentUser: builder.query<User, string>({
    query: (id) => `users/${id}`,
    providesTags: (result, error, id) => [{ type: 'User', id }],
  }),

  // Опционально: создание пользователя (для демо)
  createUser: builder.mutation<User, { username: string; name: string }>({
    query: (newUser) => ({
      url: 'users',
      method: 'POST',
      body: newUser,
    }),
    invalidatesTags: [{ type: 'User', id: 'LIST' }],
  }),
});

export type AuthEndpoints = ReturnType<typeof authEndpoints>;