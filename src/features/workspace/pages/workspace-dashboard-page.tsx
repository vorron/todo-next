'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { slugify } from '@/shared/lib/utils/slugify';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ConfirmationDialog,
} from '@/shared/ui';

import { CreateWorkspaceDialog } from '../components';
import { useCreateWorkspaceDialog } from '../hooks';
import { useDeleteWorkspace } from '../model/mutations';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceDashboardPageProps {
  workspace: Workspace | null;
}

export function WorkspaceDashboardPage({ workspace }: WorkspaceDashboardPageProps) {
  const router = useRouter();
  const { deleteWorkspace, isDeleting } = useDeleteWorkspace();
  const createWorkspaceDialog = useCreateWorkspaceDialog();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const _title = useMemo(() => workspace?.name || 'Dashboard', [workspace]);

  const handleDeleteWorkspace = async () => {
    if (!workspace) return;

    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!workspace) return;

    try {
      await deleteWorkspace(workspace.id);
      // После успешного удаления редирект на /tracker/manage
      router.push('/tracker/manage');
    } catch (error) {
      console.error('Failed to delete workspace:', error);
    }
  };

  if (!workspace) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No workspace selected</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{workspace.name}</h1>
            <p className="text-muted-foreground">Time tracking workspace</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Switch Workspace</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/workspace/manage')}>
                Manage Workspaces
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/workspace/select')}>
                Select Different Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-muted-foreground">
          {workspace.description || 'Manage your tasks and projects'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">0</div>
            <p className="text-sm text-muted-foreground">Active tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">0</div>
            <p className="text-sm text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{workspace.ownerId}</div>
            <p className="text-sm text-muted-foreground">Workspace owner</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20"
              onClick={() =>
                router.push(`/tracker/${slugify(workspace.name)}-${workspace.id}/reports`)
              }
            >
              <div className="text-center">
                <div className="text-lg">📊</div>
                <div className="text-sm">Reports</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-20"
              onClick={() =>
                router.push(`/tracker/${slugify(workspace.name)}-${workspace.id}/projects`)
              }
            >
              <div className="text-center">
                <div className="text-lg">📝</div>
                <div className="text-sm">Projects</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <div className="text-lg">⚙️</div>
                <div className="text-sm">Settings</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-20"
              onClick={() =>
                router.push(`/tracker/${slugify(workspace.name)}-${workspace.id}/time-entry`)
              }
            >
              <div className="text-center">
                <div className="text-lg">⏱️</div>
                <div className="text-sm">Time Entry</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Workspace Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">ID:</span>
              <span className="text-sm text-muted-foreground">{workspace.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Created:</span>
              <span className="text-sm text-muted-foreground">
                {new Date(workspace.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Updated:</span>
              <span className="text-sm text-muted-foreground">
                {new Date(workspace.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workspace Management */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Workspace Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <h4 className="font-medium">Delete Workspace</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently remove this workspace and all its data
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDeleteWorkspace}
                disabled={!workspace || isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <h4 className="font-medium">Create New Workspace</h4>
                <p className="text-sm text-muted-foreground">
                  Create a new workspace for your team
                </p>
              </div>
              <Button onClick={createWorkspaceDialog.openDialog}>Create</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateWorkspaceDialog
        open={createWorkspaceDialog.isOpen}
        onOpenChange={createWorkspaceDialog.setIsOpen}
        onSuccess={() => {
          router.push('/tracker/manage'); // Перейти к управлению workspace после создания
        }}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Workspace"
        description={`Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
