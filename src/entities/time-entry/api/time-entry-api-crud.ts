/**
 * Time Entry CRUD Endpoints
 * RTK Query эндпоинты для time entry с улучшенными паттернами
 */

import { createValidatedEndpoint, createEntityTags } from '@/shared/api';

import { timeEntrySchema, createTimeEntrySchema, updateTimeEntrySchema } from '../model/schema';

import type { TimeEntry } from '../model/schema';
import type { BaseApiEndpointBuilder } from '@/shared/api';

const timeEntryTags = createEntityTags('TimeEntry');

export function buildTimeEntryCrudEndpoints(builder: BaseApiEndpointBuilder) {
  return {
    // Получение списка time entries
    getTimeEntries: builder.query<TimeEntry[], void>({
      query: () => 'time-entries',
      providesTags: timeEntryTags.provideListTags,
      ...createValidatedEndpoint(timeEntrySchema.array()),
    }),

    // Получение time entries по userId
    getTimeEntriesByUser: builder.query<TimeEntry[], string>({
      query: (userId) => `time-entries?userId=${userId}`,
      providesTags: timeEntryTags.provideListTags,
      ...createValidatedEndpoint(timeEntrySchema.array()),
    }),

    // Получение time entries по workspace
    getTimeEntriesByWorkspace: builder.query<TimeEntry[], string>({
      query: (workspaceId) => `time-entries?workspaceId=${workspaceId}`,
      providesTags: timeEntryTags.provideListTags,
      ...createValidatedEndpoint(timeEntrySchema.array()),
    }),

    // Получение одного time entry по ID
    getTimeEntryById: builder.query<TimeEntry, string>({
      query: (id) => `time-entries/${id}`,
      providesTags: (result, error, id) => [{ type: 'TimeEntry', id }],
      ...createValidatedEndpoint(timeEntrySchema),
    }),

    // Создание time entry
    createTimeEntry: builder.mutation<TimeEntry, Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>>(
      {
        query: (data) => {
          const validatedData = createTimeEntrySchema.parse(data);

          return {
            url: 'time-entries',
            method: 'POST',
            body: validatedData,
          };
        },
        invalidatesTags: timeEntryTags.invalidateListTags,
        ...createValidatedEndpoint(timeEntrySchema),
      },
    ),

    // Обновление time entry
    updateTimeEntry: builder.mutation<TimeEntry, { id: string; updates: Partial<TimeEntry> }>({
      query: ({ id, ...data }) => {
        const validatedData = updateTimeEntrySchema.parse({ id, ...data });

        return {
          url: `time-entries/${id}`,
          method: 'PATCH',
          body: validatedData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'TimeEntry', id },
        { type: 'TimeEntry', id: 'LIST' },
      ],
      ...createValidatedEndpoint(timeEntrySchema),
    }),

    // Удаление time entry
    deleteTimeEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `time-entries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'TimeEntry', id },
        { type: 'TimeEntry', id: 'LIST' },
      ],
    }),
  } as const;
}
