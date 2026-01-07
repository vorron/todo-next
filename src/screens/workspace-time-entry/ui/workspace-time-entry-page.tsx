'use client';

import { useMemo } from 'react';

import { XCircle } from 'lucide-react';

import { useWorkspaceById } from '@/features/workspace/model/queries';
import { WorkspaceTimeEntryPage as WorkspaceTimeEntryPageContent } from '@/features/workspace/pages/workspace-time-entry-page';
import { parseSlugId } from '@/shared/lib/utils/slug-id';
import { DataLoadingState, ErrorStateCard, useHeaderFromTemplate } from '@/shared/ui';

export function WorkspaceTimeEntryPage({ params }: { params: { id: string } }) {
  const { workspaceId } = parseSlugId(params.id);
  const { workspace, isLoading, error } = useWorkspaceById(workspaceId);

  // Adapt workspace data to match expected header template format with memoization
  const headerData = useMemo(
    () =>
      workspace
        ? {
            id: workspace.id,
            text: workspace.name,
          }
        : null,
    [workspace],
  );

  useHeaderFromTemplate(headerData, 'workspaceTimeEntry');

  if (isLoading) {
    return <DataLoadingState message="Loading time entry..." />;
  }

  if (error || !workspace) {
    return (
      <ErrorStateCard
        icon={<XCircle className="w-8 h-8 text-red-600" />}
        title="Workspace Not Found"
        description="The workspace you're looking for doesn't exist or you don't have access to it."
        actionLabel="Go Back"
        onAction={() => window.history.back()}
      />
    );
  }

  return <WorkspaceTimeEntryPageContent workspace={workspace} />;
}
