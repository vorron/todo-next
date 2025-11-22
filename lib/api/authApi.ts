//import { User } from "@/types";
import { User } from "@/entities/user";
import type { AppBuilder } from "@/types";

export const authEndpoints = (builder: AppBuilder) => ({
  // Получение всех пользователей
  getUsers: builder.query<User[], void>({
    query: () => "users",
    providesTags: [{ type: "User", id: "LIST" }],
  }),

  // Получение конкретного пользователя
  getCurrentUser: builder.query<User, string>({
    query: (id: string) => `users/${id}`,
    providesTags: ({ id }: { id: string }) => [{ type: "User", id }],
  }),

  // Опционально: создание пользователя (для демо)
  createUser: builder.mutation<User, { username: string; name: string }>({
    query: (newUser) => ({
      url: "users",
      method: "POST",
      body: newUser,
    }),
    invalidatesTags: [{ type: "User", id: "LIST" }],
  }),
});

export type AuthEndpoints = ReturnType<typeof authEndpoints>;
