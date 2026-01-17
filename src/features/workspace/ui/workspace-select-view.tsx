'use client';

import { useRouter } from 'next/navigation';

import { useWorkspaces } from '@/entities/workspace/model';

import { CreateWorkspaceDialog } from './create-workspace-dialog';
import { WorkspaceSelector } from '../components/workspace-selector';
import { useCreateWorkspaceDialog } from '../hooks';
import { createWorkspaceActions } from '../lib/workspace-management';

import type { Workspace } from '@/entities/workspace/model/schema';

export function WorkspaceSelectView() {
  const router = useRouter();
  const { workspaces, isLoading, error, refetch } = useWorkspaces();
  const createWorkspaceDialog = useCreateWorkspaceDialog();
  const actions = createWorkspaceActions(router);

  const handleWorkspaceSelect = (workspace: Workspace) => {
    // Navigate to workspace time entry
    actions.goToTimeEntry(workspace.id);
  };

  return (
    <>
      <WorkspaceSelector
        workspaces={workspaces}
        isLoading={isLoading}
        error={error}
        onWorkspaceSelect={handleWorkspaceSelect}
        onCreateNew={createWorkspaceDialog.openDialog}
      />

      <CreateWorkspaceDialog
        open={createWorkspaceDialog.isOpen}
        onOpenChange={createWorkspaceDialog.setIsOpen}
        onSuccess={() => {
          refetch();
          actions.goToSelect();
        }}
      />
    </>
  );
}
