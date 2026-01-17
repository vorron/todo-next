'use client';

import { useMemo } from 'react';

import { XCircle } from 'lucide-react';

import { useWorkspaceById } from '@/entities/workspace/model';
import { DashboardView } from '@/features/workspace/ui';
import { DataLoadingState, ErrorStateCard, useHeaderFromTemplate } from '@/shared/ui';

export interface WorkspaceDashboardPageProps {
  params: { id: string };
}

export function WorkspaceDashboardPage({ params }: WorkspaceDashboardPageProps) {
  const { workspace, isLoading, error } = useWorkspaceById(params.id);

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

  useHeaderFromTemplate(headerData, 'workspaceDashboard');

  if (isLoading) {
    return <DataLoadingState message="Loading workspace dashboard..." />;
  }

  if (error || !workspace) {
    return (
      <ErrorStateCard
        icon={<XCircle className="w-8 h-8 text-red-600" />}
        title="Workspace Not Found"
        description="The workspace you're looking for doesn't exist or you don't have access to it."
        actionLabel="Go back to workspaces"
        onAction={() => window.history.back()}
      />
    );
  }

  return <DashboardView workspace={workspace} />;
}
