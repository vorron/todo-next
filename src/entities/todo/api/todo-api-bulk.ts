import type { BaseApiEndpointBuilder } from '@/shared/api';

import { todosSchema } from '../model/todo-schema';

export function buildTodoBulkEndpoints(builder: BaseApiEndpointBuilder) {
  return {
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
