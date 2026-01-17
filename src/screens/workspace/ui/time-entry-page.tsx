'use client';

import { WorkspaceInfoCard } from '@/features/workspace/components';
import { TimeEntryView, WorkspaceActionsBar } from '@/features/workspace/ui';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceTimeEntryPageProps {
  workspace: Workspace;
  workspaces: Workspace[];
}

export function TimeEntryPage({ workspace, workspaces }: WorkspaceTimeEntryPageProps) {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <WorkspaceActionsBar workspaces={workspaces} currentWorkspaceId={workspace?.id} />

      {/* Основной блок таймера - фокус на действии */}
      <TimeEntryView className="max-w-2xl mx-auto" />

      {/* Информация о workspace - минимизированная */}
      <WorkspaceInfoCard workspace={workspace} className="max-w-2xl mx-auto" />
    </div>
  );
}
