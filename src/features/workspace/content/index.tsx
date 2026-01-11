'use client';

import { DataLoadingState, DataErrorState } from '@/shared/ui';

import { useWorkspaceState, useWorkspaceUrlSync } from './model';
import { WorkspaceRouter } from './ui/workspace-router';

/**
 * Workspace Content
 * Основная логика по паттерну todos
 */
export function WorkspaceContent() {
  const workspaceState = useWorkspaceState();
  const { isLoading, error, refetch } = useWorkspaceUrlSync(workspaceState);

  if (isLoading) {
    return <DataLoadingState message="Loading workspace..." />;
  }

  if (error) {
    return <DataErrorState description="Failed to load workspace" onRetry={refetch} />;
  }

  return <WorkspaceRouter workspaceState={workspaceState} />;
}

// Экспорты для разных контентов
export { WorkspaceManageContent } from './workspace-manage-content';
