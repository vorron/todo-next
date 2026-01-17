'use client';

import { useRouter } from 'next/navigation';

import { useWorkspaces } from '@/entities/workspace/model';

import { CreateWorkspaceDialog } from './create-workspace-dialog';
import { WorkspaceList } from '../components/workspace-list';
import { useCreateWorkspaceDialog } from '../hooks';
import { createWorkspaceActions } from '../lib/workspace-management';

import type { Workspace } from '@/entities/workspace/model/schema';

export function WorkspaceManageView() {
  const router = useRouter();
  const { workspaces, isLoading, error, refetch } = useWorkspaces();
  const createWorkspaceDialog = useCreateWorkspaceDialog();
  const actions = createWorkspaceActions(router);

  const handleWorkspaceClick = (workspace: Workspace) => {
    // Navigate to workspace dashboard
    actions.goToTimeEntry(workspace.id);
  };

  return (
    <>
      <WorkspaceList
        workspaces={workspaces}
        isLoading={isLoading}
        error={error}
        onWorkspaceClick={handleWorkspaceClick}
        onCreateNew={createWorkspaceDialog.openDialog}
      />

      <CreateWorkspaceDialog
        open={createWorkspaceDialog.isOpen}
        onOpenChange={createWorkspaceDialog.setIsOpen}
        onSuccess={() => {
          refetch();
          actions.goToManage();
        }}
      />
    </>
  );
}
