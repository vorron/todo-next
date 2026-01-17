'use client';

import { useMemo } from 'react';

import { XCircle } from 'lucide-react';

import { useWorkspaceById } from '@/entities/workspace/model';
import { ProjectsView } from '@/features/workspace/ui';
import { DataLoadingState, ErrorStateCard, useHeaderFromTemplate } from '@/shared/ui';

export interface WorkspaceProjectsPageProps {
  params: { id: string };
}

export function WorkspaceProjectsPage({ params }: WorkspaceProjectsPageProps) {
  const { workspace, isLoading, error } = useWorkspaceById(params.id);

  const headerData = useMemo(
    () =>
      workspace
        ? {
            id: workspace.id,
            text: `${workspace.name} - Projects`,
          }
        : null,
    [workspace],
  );

  useHeaderFromTemplate(headerData, 'workspaceProjects');

  if (isLoading) {
    return <DataLoadingState message="Loading workspace projects..." />;
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

  return <ProjectsView workspace={workspace} />;
}
