'use client';

import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui';

import { formatDate, isDefaultWorkspace } from '../lib/workspace-management';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceListProps {
  workspaces: Workspace[];
  isLoading?: boolean;
  error?: unknown;
  onWorkspaceClick?: (workspace: Workspace) => void;
  onCreateNew?: () => void;
  className?: string;
}

export function WorkspaceList({
  workspaces,
  isLoading,
  error,
  onWorkspaceClick,
  onCreateNew,
  className,
}: WorkspaceListProps) {
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Workspaces</h1>
          {onCreateNew && <Button onClick={onCreateNew}>Create New Workspace</Button>}
        </div>

        {workspaces.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No workspaces found</p>
              <p className="text-sm text-gray-500 mt-2">
                Create your first workspace to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <Card
                key={workspace.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onWorkspaceClick?.(workspace)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {workspace.name}
                    {isDefaultWorkspace(workspace) && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {workspace.description || 'No description'}
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>ID: {workspace.id}</div>
                    <div>Owner: {workspace.ownerId}</div>
                    <div>Created: {formatDate(workspace.createdAt)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
