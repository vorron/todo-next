import { todosSchema } from '../model/todo-schema';
import { type baseApi } from '@/shared/api';

type Builder = Parameters<typeof baseApi.injectEndpoints>[0]['endpoints'] extends (
  builder: infer TBuilder,
) => unknown
  ? TBuilder
  : never;

export function buildTodoBulkEndpoints(builder: Builder) {
  return {
    // Массовое обновление (пометить все как выполненные/невыполненные)
    toggleAllTodos: builder.mutation<void, { userId: string; completed: boolean }>({
      async queryFn({ userId, completed }, api, extraOptions, baseQuery) {
        // Получаем все todos пользователя
        const todosResult = await baseQuery({
          url: 'todos',
          params: { userId },
        });

        if (todosResult.error) return { error: todosResult.error };

        const todos = todosSchema.parse(todosResult.data);

        // Обновляем каждый todo
        await Promise.all(
          todos.map((todo) =>
            baseQuery({
              url: `todos/${todo.id}`,
              method: 'PATCH',
              body: {
                completed,
                updatedAt: new Date().toISOString(),
              },
            }),
          ),
        );

        return { data: undefined };
      },
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),

    // Удаление всех выполненных todos
    clearCompleted: builder.mutation<void, string>({
      async queryFn(userId, api, extraOptions, baseQuery) {
        // Получаем выполненные todos
        const todosResult = await baseQuery({
          url: 'todos',
          params: { userId, completed: true },
        });

        if (todosResult.error) return { error: todosResult.error };

        const todos = todosSchema.parse(todosResult.data);

        // Удаляем каждый
        await Promise.all(
          todos.map((todo) =>
            baseQuery({
              url: `todos/${todo.id}`,
              method: 'DELETE',
            }),
          ),
        );

        return { data: undefined };
      },
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),
  } as const;
}
