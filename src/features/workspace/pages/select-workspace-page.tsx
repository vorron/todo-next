'use client';

import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui';

import { useWorkspaceContext } from '../model/workspace-context';

export function SelectWorkspacePage() {
  const { workspaces, currentWorkspace, actions } = useWorkspaceContext();

  const handleSelectWorkspace = (workspaceId: string) => {
    actions.setCurrentWorkspace(workspaceId);
  };

  const handleCreateWorkspace = () => {
    actions.goToCreateWorkspace();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Workspace</h1>
          <p className="text-muted-foreground">
            Choose a workspace to continue working on your tasks and projects.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                currentWorkspace?.id === workspace.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelectWorkspace(workspace.id)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{workspace.name}</CardTitle>
                {workspace.description && (
                  <p className="text-sm text-muted-foreground">{workspace.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Owner workspace</div>
                  <Button
                    size="sm"
                    variant={currentWorkspace?.id === workspace.id ? 'secondary' : 'default'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectWorkspace(workspace.id);
                    }}
                  >
                    {currentWorkspace?.id === workspace.id ? 'Current' : 'Select'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={handleCreateWorkspace}>
            Create New Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
