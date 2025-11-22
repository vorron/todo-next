import { baseApi } from "@/shared/api";
import { userSchema } from "@/entities/user";
import type { User } from "@/entities/user";
import type { LoginResponse } from "@/features/auth/model/types";
import { createMockSession } from "../lib/session";
import { LoginDto } from "@/features/auth/model/auth-schema";

// Типы для ошибок API
interface ApiError {
  status: number;
  data: {
    message: string;
  };
}

/**
 * Mock API для аутентификации
 * В будущем заменится на реальные endpoints
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Mock login - находит пользователя по username
     */
    login: builder.mutation<LoginResponse, LoginDto>({
      async queryFn({ username }, api, extraOptions, baseQuery) {
        try {
          // Получаем список пользователей
          const result = await baseQuery("users");

          if (result.error) {
            return { error: result.error };
          }

          // Типизируем данные как массив пользователей
          const users = userSchema.array().parse(result.data);
          const user = users.find(
            (u) => u.username.toLowerCase() === username.toLowerCase()
          );

          if (!user) {
            const error: ApiError = {
              status: 401,
              data: { message: "User not found" },
            };
            return { error };
          }

          // Создаем mock сессию
          const session = createMockSession(user.id, user.username, user.name);

          return {
            data: {
              session,
              message: "Login successful",
            },
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Login failed";
          const apiError: ApiError = {
            status: 500,
            data: { message: "Login failed:" + errorMessage },
          };
          return { error: apiError };
        }
      },
      invalidatesTags: ["Auth"],
    }),

    /**
     * Mock logout
     */
    logout: builder.mutation<void, void>({
      queryFn: async () => {
        // Здесь будет API запрос для инвалидации токена
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { data: undefined };
      },
      invalidatesTags: ["Auth", "Todo", "User"],
    }),

    /**
     * Проверка сессии (refresh)
     */
    validateSession: builder.query<User, string>({
      query: (userId) => `users/${userId}`,
      transformResponse: (response: unknown) => {
        return userSchema.parse(response);
      },
      providesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useValidateSessionQuery } =
  authApi;
