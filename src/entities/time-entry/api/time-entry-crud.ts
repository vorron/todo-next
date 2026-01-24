import { createEntityTags } from '@/shared/api';

import {
  type CreateTimeEntry,
  createTimeEntrySchema,
  timeEntrySchema,
  type UpdateTimeEntry,
  updateTimeEntrySchema,
  type TimeEntry,
} from '../model/schema';

import type { BaseApiEndpointBuilder } from '@/shared/api';

const timeEntryTags = createEntityTags('TimeEntry');

export function buildTimeEntryCrudEndpoints(builder: BaseApiEndpointBuilder) {
  return {
    getTimeEntriesByUserId: builder.query<
      TimeEntry[],
      {
        workspaceId: string;
        userId?: string;
        date?: string;
      }
    >({
      query: ({ workspaceId, userId, date }) => {
        const params = new URLSearchParams();
        params.append('workspaceId', workspaceId);
        if (userId) params.append('userId', userId);
        if (date) params.append('date', date);
        return `time-entries?${params.toString()}`;
      },
      providesTags: timeEntryTags.provideListTags,
      transformResponse: (response: unknown): TimeEntry[] => {
        if (!response || !Array.isArray(response)) {
          return [];
        }

        try {
          return timeEntrySchema.array().parse(response);
        } catch (error) {
          // В development логируем ошибки парсинга
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to parse time entries:', error);
          }
          return [];
        }
      },
    }),

    createTimeEntry: builder.mutation<TimeEntry, CreateTimeEntry>({
      query: (data) => {
        const validatedData = createTimeEntrySchema.parse(data);

        return {
          url: 'time-entries',
          method: 'POST',
          body: validatedData,
        };
      },
      invalidatesTags: timeEntryTags.invalidateListTags,
      transformResponse: (response: unknown): TimeEntry => {
        if (!response) {
          throw new Error('No response received');
        }
        return timeEntrySchema.parse(response);
      },
    }),

    updateTimeEntry: builder.mutation<TimeEntry, UpdateTimeEntry>({
      query: (data) => {
        const validatedData = updateTimeEntrySchema.parse(data);

        return {
          url: `time-entries/${data.id}`,
          method: 'PUT',
          body: validatedData,
        };
      },
      invalidatesTags: timeEntryTags.invalidateListTags,
      transformResponse: (response: unknown): TimeEntry => {
        if (!response) {
          throw new Error('No response received');
        }
        return timeEntrySchema.parse(response);
      },
    }),

    deleteTimeEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `time-entries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: timeEntryTags.invalidateListTags,
    }),
  };
}
