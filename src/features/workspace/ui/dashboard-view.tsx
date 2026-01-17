'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

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

import { CreateWorkspaceDialog } from './create-workspace-dialog';
import { DashboardCards } from '../components/dashboard-cards';
import { QuickActions } from '../components/quick-actions';
import { WorkspaceInfo } from '../components/workspace-info';
import { createWorkspaceActions } from '../lib/workspace-management';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface DashboardViewProps {
  workspace: Workspace;
  className?: string;
}

export function DashboardView({ workspace, className }: DashboardViewProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const actions = createWorkspaceActions(router);

  const handleDeleteWorkspace = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement delete workspace logic
    console.log('Deleting workspace:', workspace.id);
    actions.goToManage();
  };

  return (
    <div className={`container mx-auto py-8 ${className}`}>
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
              <DropdownMenuItem onClick={actions.goToManage}>Manage Workspaces</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={actions.goToSelect}>
                Select Different Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-muted-foreground">
          {workspace.description || 'Manage your tasks and projects'}
        </p>
      </div>

      <DashboardCards workspace={workspace} className="mt-6" />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickActions
            onReportsClick={() => actions.goToReports(workspace.id)}
            onProjectsClick={() => actions.goToProjects(workspace.id)}
            onTimeEntryClick={() => actions.goToTimeEntry(workspace.id)}
            onSettingsClick={() => console.log('Settings clicked')}
          />
        </CardContent>
      </Card>

      <WorkspaceInfo workspace={workspace} className="mt-6" />

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
              <Button variant="destructive" onClick={handleDeleteWorkspace}>
                Delete
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <h4 className="font-medium">Create New Workspace</h4>
                <p className="text-sm text-muted-foreground">
                  Create a new workspace for your team
                </p>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>Create</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateWorkspaceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={actions.goToManage}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Workspace"
        description={`Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
