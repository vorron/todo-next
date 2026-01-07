'use client';

import { useMemo } from 'react';

import { XCircle } from 'lucide-react';

import { useWorkspaceById } from '@/features/workspace/model/queries';
import { ReportsPage } from '@/features/workspace/pages';
import { parseSlugId } from '@/shared/lib/utils/slug-id';
import { DataLoadingState, ErrorStateCard, useHeaderFromTemplate } from '@/shared/ui';

export function WorkspaceReportsPage({ params }: { params: { id: string } }) {
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

  useHeaderFromTemplate(headerData, 'workspaceReports');

  if (isLoading) {
    return <DataLoadingState message="Loading workspace reports..." />;
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

  return <ReportsPage workspace={workspace} />;
}
