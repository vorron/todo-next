'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useWorkspaces } from '@/features/workspace/model/queries';
import { ROUTES } from '@/shared/lib/router';
import { slugify } from '@/shared/lib/utils/slugify';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui';

import { CreateWorkspaceDialog } from '../components';
import { useCreateWorkspaceDialog } from '../hooks';

import type { Workspace } from '@/entities/workspace/model/schema';

/**
 * Workspace Hub Content
 * Overview всех workspace + smart actions
 */
export function WorkspaceHubContent() {
  const router = useRouter();
  const { workspaces, isLoading, error, refetch: _refetch } = useWorkspaces();
  const createWorkspaceDialog = useCreateWorkspaceDialog();

  // Smart redirect logic - prioritize default workspace
  useEffect(() => {
    if (isLoading || error) return;

    if (workspaces.length === 0) {
      // No workspaces → show create dialog
      createWorkspaceDialog.openDialog();
      return;
    }

    // Find default workspace
    const defaultWorkspace = workspaces.find((w) => w.isDefault);
    const firstWorkspace = workspaces[0];
    const targetWorkspace = defaultWorkspace || firstWorkspace;

    if (targetWorkspace) {
      // Always redirect to default/first workspace
      router.push(`/tracker/${slugify(targetWorkspace.name)}-${targetWorkspace.id}/time-entry`);
    }
  }, [workspaces, isLoading, error, router, createWorkspaceDialog]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-red-500">Failed to load workspaces</p>
          <Button onClick={_refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting
  if (workspaces.length > 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to workspace...</p>
        </div>
      </div>
    );
  }

  // Fallback to hub (shouldn't reach here)
  // Multiple workspaces → show hub
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Workspaces</h1>
        <p className="text-muted-foreground">Choose a workspace to work with or create a new one</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Workspace cards */}
        {workspaces.map((workspace: Workspace) => (
          <Card
            key={workspace.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() =>
              router.push(`/tracker/${slugify(workspace.name)}-${workspace.id}/time-entry`)
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {workspace.name}
                {workspace.isDefault && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workspace.description && (
                <p className="text-sm text-muted-foreground mb-4">{workspace.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Created: {new Date(workspace.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tracker/${slugify(workspace.name)}-${workspace.id}`);
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tracker/${slugify(workspace.name)}-${workspace.id}/time-entry`);
                    }}
                  >
                    Open
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create new workspace card */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow border-dashed"
          onClick={createWorkspaceDialog.openDialog}
        >
          <CardHeader>
            <CardTitle className="text-center text-muted-foreground">
              + Create New Workspace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Create a new workspace for your team
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-8 flex justify-center">
        <Button variant="outline" onClick={() => router.push(ROUTES.WORKSPACE_MANAGE)}>
          Manage Workspaces
        </Button>
      </div>

      {/* Create Workspace Dialog */}
      <CreateWorkspaceDialog
        open={createWorkspaceDialog.isOpen}
        onOpenChange={createWorkspaceDialog.setIsOpen}
        onSuccess={() => {
          // После создания workspace обновим данные без перезагрузки страницы
          _refetch();
        }}
      />
    </div>
  );
}
