'use client';

import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui';

import { isDefaultWorkspace, getWorkspaceDisplayName } from '../lib/workspace-management';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceSelectorProps {
  workspaces: Workspace[];
  isLoading?: boolean;
  error?: unknown;
  onWorkspaceSelect?: (workspace: Workspace) => void;
  onCreateNew?: () => void;
  className?: string;
}

export function WorkspaceSelector({
  workspaces,
  isLoading,
  error,
  onWorkspaceSelect,
  onCreateNew,
  className,
}: WorkspaceSelectorProps) {
  if (isLoading) {
    return (
      <div className={`container mx-auto py-8 ${className}`}>
        <div className="text-center">
          <p className="text-muted-foreground">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`container mx-auto py-8 ${className}`}>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-600">Failed to load workspaces</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`container mx-auto py-8 ${className}`}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Select Workspace</h1>
          <p className="text-muted-foreground">Choose a workspace to continue</p>
        </div>

        {workspaces.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No workspaces found</p>
              <p className="text-sm text-gray-500 mt-2">
                Create your first workspace to get started
              </p>
              {onCreateNew && (
                <Button className="mt-4" onClick={onCreateNew}>
                  Create Workspace
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {workspaces.map((workspace) => (
              <Card
                key={workspace.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onWorkspaceSelect?.(workspace)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {getWorkspaceDisplayName(workspace)}
                    {isDefaultWorkspace(workspace) && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {workspace.description || 'No description'}
                  </p>
                </CardContent>
              </Card>
            ))}

            {onCreateNew && (
              <Card className="border-dashed border-2">
                <CardContent className="text-center py-6">
                  <Button variant="ghost" onClick={onCreateNew}>
                    + Create New Workspace
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
