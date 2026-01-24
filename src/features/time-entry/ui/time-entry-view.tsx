'use client';

import { useGetTimeEntriesByUserIdQuery } from '@/entities/time-entry/api';
import { type Workspace } from '@/entities/workspace';
import { DataErrorState, DataLoadingState } from '@/shared/ui';

import { TimeEntryCanvas } from './nested/time-entry-canvas';
import { TimeEntryHeader } from './nested/time-entry-header';
import { TimeScale } from './nested/time-scale';

export interface TimeEntryViewProps {
  workspace: Workspace;
}

export function TimeEntryView({ workspace }: TimeEntryViewProps) {
  const {
    data: timeEntries,
    isLoading,
    error,
    refetch,
  } = useGetTimeEntriesByUserIdQuery({
    workspaceId: workspace.id,
    date: new Date().toISOString().split('T')[0],
  });

  if (isLoading) return <DataLoadingState message="Loading time entries..." />;

  if (error) {
    return <DataErrorState title="Failed to load time entries" error={error} onRetry={refetch} />;
  }
  return (
    <div className="flex flex-col h-full">
      <TimeEntryHeader />
      <div className="flex flex-1">
        <TimeScale />
        <TimeEntryCanvas timeEntries={timeEntries || []} />
      </div>
    </div>
  );
}
