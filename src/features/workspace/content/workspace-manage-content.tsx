'use client';

import { useRouter } from 'next/navigation';

import { useWorkspaces } from '@/features/workspace/model/queries';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui';

import { CreateWorkspaceDialog } from '../components';
import { useCreateWorkspaceDialog } from '../hooks';

/**
 * Workspace Manage Content
 * Полный список workspace для управления (без auto-redirect)
 */
export function WorkspaceManageContent() {
  const router = useRouter();
  const { workspaces, isLoading, error, refetch } = useWorkspaces();
  const createWorkspaceDialog = useCreateWorkspaceDialog();

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
          <h1 className="text-3xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground mb-4">Failed to load workspaces</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">No Workspaces</h1>
          <p className="text-muted-foreground mb-4">Create your first workspace to get started</p>
          <Button onClick={createWorkspaceDialog.openDialog}>Create Workspace</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Workspaces</h1>
        <p className="text-muted-foreground">Select a workspace to work with or create a new one</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((workspace) => (
          <Card
            key={workspace.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/tracker/${workspace.id}/time-entry`)}
          >
            <CardHeader>
              <CardTitle className="text-center">{workspace.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {workspace.description || 'No description'}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tracker/${workspace.id}`);
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tracker/${workspace.id}/time-entry`);
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
            <CardTitle className="text-center text-muted-foreground">+ Create Workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-muted-foreground">Create a new workspace to organize your work</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-8 flex justify-center">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button onClick={() => router.push('/tracker')}>Go to Default Workspace</Button>
      </div>

      {/* Create Workspace Dialog */}
      <CreateWorkspaceDialog
        open={createWorkspaceDialog.isOpen}
        onOpenChange={createWorkspaceDialog.setIsOpen}
        onSuccess={() => {
          refetch(); // Обновить список workspace после создания
        }}
      />
    </div>
  );
}
