import { createValidatedEndpoint, createEntityTags } from '@/shared/api';

import {
  todoSchema,
  todosSchema,
  createTodoSchema,
  updateTodoSchema,
  todoFilterQuerySchema,
} from '../model/todo-schema';

import type { Todo, CreateTodoDto, UpdateTodoDto, TodoFilter } from '../model/types';
import type { BaseApiEndpointBuilder } from '@/shared/api';

const todoTags = createEntityTags('Todo');

export function buildTodoCrudEndpoints(builder: BaseApiEndpointBuilder) {
  return {
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
      providesTags: todoTags.provideListTags,
      ...createValidatedEndpoint(todosSchema),
    }),

    // Получение одного todo по ID
    getTodoById: builder.query<Todo, string>({
      query: (id) => `todos/${id}`,
      providesTags: (result, error, id) => [{ type: 'Todo', id }],
      ...createValidatedEndpoint(todoSchema),
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
      invalidatesTags: todoTags.invalidateListTags,
      ...createValidatedEndpoint(todoSchema),
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
      ...createValidatedEndpoint(todoSchema),
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
  } as const;
}
