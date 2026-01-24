'use client';

import { TimeEntryView } from '@/features/time-entry/ui/time-entry-view';
import { WorkspaceInfoCard } from '@/features/workspace/components';
import { WorkspaceActionsBar } from '@/features/workspace/ui';

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
      <TimeEntryView workspace={workspace} />

      {/* Информация о workspace - минимизированная */}
      <WorkspaceInfoCard workspace={workspace} />
    </div>
  );
}
