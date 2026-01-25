'use client';

import { type Workspace } from '@/entities/workspace';
import { DataErrorState, DataLoadingState } from '@/shared/ui';

import { TimeEntryCanvas } from './nested/time-entry-canvas';
import { TimeEntryHeader } from './nested/time-entry-header';
import { TimeScale } from './nested/time-scale';
import { useTimeEntriesByUser } from '../model/queries/use-time-entries';

export interface TimeEntryViewProps {
  workspace: Workspace;
}

export function TimeEntryView({ workspace }: TimeEntryViewProps) {
  // Временно - захардкоженный userId, нужно получить из auth context
  const userId = 'user-123';

  const { data: timeEntries, isLoading, error, refetch } = useTimeEntriesByUser(userId);

  if (isLoading) return <DataLoadingState message="Loading time entries..." />;

  if (error) {
    return <DataErrorState title="Failed to load time entries" error={error} onRetry={refetch} />;
  }

  return (
    <div className="flex flex-col h-full">
      <TimeEntryHeader workspace={workspace} />
      <div className="flex flex-1">
        <TimeScale />
        <TimeEntryCanvas timeEntries={timeEntries || []} />
      </div>
    </div>
  );
}
