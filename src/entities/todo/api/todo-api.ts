import { baseApi } from '@/shared/api';
import {
  todoSchema,
  todosSchema,
  createTodoSchema,
  updateTodoSchema,
  todoFilterSchema,
} from '../model/todo-schema';
import type { Todo, CreateTodoDto, UpdateTodoDto, TodoFilter } from '../model/types';
import z from 'zod';

// Упрощенная схема фильтров без строгой UUID валидации
const todoFilterQuerySchema = todoFilterSchema.pick({
  completed: true,
  priority: true,
  search: true,
}).extend({
  userId: z.string().optional(), // Разрешаем любую строку
  tags: z.string().optional().transform(val => val ? val.split(',') : undefined),
});

export const todoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Получение списка todos с фильтрами
    getTodos: builder.query<Todo[], TodoFilter | void>({
      query: (filters) => {
        if (!filters) {
          return { url: 'todos' };
        }

        // Более мягкая валидация для query параметров
        const validatedFilters = todoFilterQuerySchema.parse(filters);

        return {
          url: 'todos',
          params: validatedFilters,
        };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Todo' as const, id })),
            { type: 'Todo', id: 'LIST' },
          ]
          : [{ type: 'Todo', id: 'LIST' }],
      transformResponse: (response: unknown) => {
        return todosSchema.parse(response);
      },
    }),

    // Получение одного todo по ID
    getTodoById: builder.query<Todo, string>({
      query: (id) => `todos/${id}`,
      providesTags: (result, error, id) => [{ type: 'Todo', id }],
      transformResponse: (response: unknown) => {
        return todoSchema.parse(response);
      },
    }),

    // Создание todo
    createTodo: builder.mutation<Todo, CreateTodoDto>({
      query: (data) => {
        const validatedData = createTodoSchema.parse(data);

        return {
          url: 'todos',
          method: 'POST',
          body: {
            ...validatedData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      },
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
      transformResponse: (response: unknown) => {
        return todoSchema.parse(response);
      },
    }),

    // Обновление todo
    updateTodo: builder.mutation<Todo, UpdateTodoDto>({
      query: ({ id, ...data }) => {
        const validatedData = updateTodoSchema.parse({ id, ...data });

        return {
          url: `todos/${id}`,
          method: 'PATCH',
          body: {
            ...validatedData,
            updatedAt: new Date().toISOString(),
          },
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' },
      ],
      transformResponse: (response: unknown) => {
        return todoSchema.parse(response);
      },
    }),

    // Удаление todo
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' },
      ],
    }),

    // Переключение статуса todo
    toggleTodo: builder.mutation<Todo, string>({
      async queryFn(id, api, extraOptions, baseQuery) {
        // Сначала получаем текущее todo
        const currentResult = await baseQuery(`todos/${id}`);

        if (currentResult.error) return { error: currentResult.error };

        const currentTodo = todoSchema.parse(currentResult.data);

        // Обновляем статус
        const updateResult = await baseQuery({
          url: `todos/${id}`,
          method: 'PATCH',
          body: {
            completed: !currentTodo.completed,
            updatedAt: new Date().toISOString(),
          },
        });

        if (updateResult.error) return { error: updateResult.error };

        return { data: todoSchema.parse(updateResult.data) };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' },
      ],
    }),

    // Массовое обновление (пометить все как выполненные)
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
            })
          )
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
            })
          )
        );

        return { data: undefined };
      },
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoMutation,
  useToggleAllTodosMutation,
  useClearCompletedMutation,
} = todoApi;