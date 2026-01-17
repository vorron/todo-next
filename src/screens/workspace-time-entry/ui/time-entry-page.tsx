'use client';

import { TimeEntryPage as WorkspaceTimeEntryComponent } from '@/features/workspace/pages';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceTimeEntryScreenProps {
  workspace: Workspace;
  workspaces: Workspace[];
}

export function TimeEntryPage({ workspace, workspaces }: WorkspaceTimeEntryScreenProps) {
  return <WorkspaceTimeEntryComponent workspace={workspace} workspaces={workspaces} />;
}
