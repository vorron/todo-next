'use client';

import { XCircle } from 'lucide-react';

import { useWorkspaces } from '@/entities/workspace/model';
import { WorkspaceSelectView } from '@/features/workspace/ui';
import { DataLoadingState, ErrorStateCard, useHeaderFromTemplate } from '@/shared/ui';

export function WorkspaceSelectPage() {
  const { isLoading, error, refetch } = useWorkspaces();

  useHeaderFromTemplate(null, 'todos');

  if (isLoading) {
    return <DataLoadingState message="Loading workspaces..." />;
  }

  if (error) {
    return (
      <ErrorStateCard
        icon={<XCircle className="w-8 h-8 text-red-600" />}
        title="Error Loading Workspaces"
        description="Failed to load workspaces. Please try again."
        actionLabel="Retry"
        onAction={refetch}
      />
    );
  }

  return <WorkspaceSelectView />;
}
