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

          if (result.error) {
            return { error: result.error };
          }

          const user = users.find(
            (u) => u.username.toLowerCase() === username.toLowerCase()
          );

          if (!user) {
              status: 401,
            };
          }

          // Создаем mock сессию
          const session = createMockSession(user.id, user.username, user.name);

          return {
            data: {
              session,
            },
          };
        } catch (error) {
            status: 500,
          };
        }
      },
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
    }),

    /**
     * Проверка сессии (refresh)
     */
    validateSession: builder.query<User, string>({
      query: (userId) => `users/${userId}`,
      transformResponse: (response: unknown) => {
        return userSchema.parse(response);
      },
    }),
  }),
});
