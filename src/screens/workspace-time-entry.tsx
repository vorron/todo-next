'use client';

import { WorkspaceTimeEntryPage as WorkspaceTimeEntryComponent } from '@/features/workspace/pages';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceTimeEntryScreenProps {
  workspace: Workspace | null;
}

export function WorkspaceTimeEntryPage({ workspace }: WorkspaceTimeEntryScreenProps) {
  return <WorkspaceTimeEntryComponent workspace={workspace} />;
}
