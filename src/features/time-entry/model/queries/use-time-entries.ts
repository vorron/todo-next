import { timeEntryApi } from '@/entities/time-entry';

export function useTimeEntries() {
  return timeEntryApi.endpoints.getTimeEntries.useQuery();
}

export function useTimeEntriesByUser(userId: string) {
  return timeEntryApi.endpoints.getTimeEntriesByUser.useQuery(userId);
}

export function useTimeEntriesByWorkspace(workspaceId: string) {
  return timeEntryApi.endpoints.getTimeEntriesByWorkspace.useQuery(workspaceId);
}

export function useTimeEntryById(id: string) {
  return timeEntryApi.endpoints.getTimeEntryById.useQuery(id);
}
