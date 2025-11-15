// lib/api/todos/todosApi.ts
import { Todo } from '@/types';
import type { AppBuilder } from '@/types';

export const todoEndpoints = (builder: AppBuilder) => ({
    // Получение todos с фильтрацией по пользователю
    getTodos: builder.query<Todo[], string | void>({
        query: (userId) => ({
            url: 'todos',
            params: userId ? { userId } : {},
        }),
        providesTags: (result) =>
            result
                ? [
                    ...result.map(({ id }) => ({ type: 'Todo' as const, id })),
                    { type: 'Todo', id: 'LIST' },
                ]
                : [{ type: 'Todo', id: 'LIST' }],
    }),

    // Добавление todo
    addTodo: builder.mutation<Todo, { text: string; userId: string }>({
        query: (newTodo) => ({
            url: 'todos',
            method: 'POST',
            body: {
                ...newTodo,
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        }),
        invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),

    // Обновление todo
    updateTodo: builder.mutation<Todo, Partial<Todo> & { id: string }>({
        query: ({ id, ...patch }) => ({
            url: `todos/${id}`,
            method: 'PATCH',
            body: {
                ...patch,
                updatedAt: new Date().toISOString(),
            },
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Todo', id }],
    }),

    // Удаление todo
    deleteTodo: builder.mutation<void, string>({
        query: (id) => ({
            url: `todos/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Todo', id }],
    }),

    // Опционально: массовое обновление
    toggleAllTodos: builder.mutation<Todo[], { completed: boolean; userId: string }>({
        query: ({ completed, userId }) => ({
            url: 'todos',
            method: 'PATCH',
            body: { completed },
            params: { userId },
        }),
        invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),

    // Опционально: очистка завершенных
    clearCompleted: builder.mutation<void, string>({
        query: (userId) => ({
            url: 'todos',
            method: 'DELETE',
            params: { userId, completed: true },
        }),
        invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),
});

export type TodoEndpoints = ReturnType<typeof todoEndpoints>;