import { createEntityApi } from '@/shared/api/entity-api-factory';

import { buildTimeEntryCrudEndpoints } from './time-entry-crud';

export const {
  useGetTimeEntriesByUserIdQuery,
  useCreateTimeEntryMutation,
  useUpdateTimeEntryMutation,
  useDeleteTimeEntryMutation,
} = createEntityApi(buildTimeEntryCrudEndpoints);
