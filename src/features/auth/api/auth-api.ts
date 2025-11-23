import { baseApi } from '@/shared/api';
import { userSchema } from '@/entities/user';
import type { User } from '@/entities/user';
import type { LoginDto, LoginResponse } from '../model/types';
import { createMockSession } from '../lib/session';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ApiError {
  status: number;
  data: { message: string };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginDto>({
      async queryFn({ username }, _api, _extraOptions, baseQuery) {
        try {
          const result = await baseQuery('users');

          if (result.error) {
            return { error: result.error as FetchBaseQueryError };
          }

          const users = result.data as User[];
          const user = users.find(
            (u) => u.username.toLowerCase() === username.toLowerCase()
          );

          if (!user) {
            const error: ApiError = {
              status: 401,
              data: { message: 'User not found' },
            };
            return { error: error as FetchBaseQueryError };
          }

          const session = createMockSession(user.id, user.username, user.name);

          return {
            data: {
              session,
              message: 'Login successful',
            },
          };
        } catch {
          const error: ApiError = {
            status: 500,
            data: { message: 'Login failed' },
          };
          return { error: error as FetchBaseQueryError };
        }
      },
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      queryFn: async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 300));
          return { data: { success: true } };
        } catch {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Logout failed'
            } as FetchBaseQueryError
          };
        }
      },
      invalidatesTags: ['Auth', 'Todo', 'User'],
    }),

    validateSession: builder.query<User, string>({
      query: (userId) => `users/${userId}`,
      transformResponse: (response: unknown) => {
        return userSchema.parse(response);
      },
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useValidateSessionQuery,
} = authApi;