import { useCallback } from 'react';

import { timeEntryApi } from '@/entities/time-entry';

import type { TimeEntryFormData } from '../time-entry-form-schemas';

export function useCreateTimeEntry() {
  const [, { isLoading: isCreating }] = timeEntryApi.endpoints.createTimeEntry.useMutation();

  const createTimeEntry = useCallback(async (data: TimeEntryFormData & { workspaceId: string }) => {
    // Трансформируем данные для API
    const timeEntryData = {
      description: data.description,
      projectId: data.projectId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      userId: data.userId,
      workspaceId: data.workspaceId,
      tags: data.tags || undefined, // Преобразуем null в undefined
      taskId: data.taskId || undefined, // Преобразуем null в undefined
    };

    const response = await fetch('http://localhost:3001/api/time-entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(timeEntryData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create time entry');
    }

    return response.json();
  }, []);

  return {
    createTimeEntry,
    isCreating,
  };
}
