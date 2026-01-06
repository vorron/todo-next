'use client';

import { useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui';

import { useWorkspaceContext } from '../model/workspace-context';

export function WorkspaceDashboardPage() {
  const { workspaces, currentWorkspace, actions } = useWorkspaceContext();

  const title = useMemo(() => currentWorkspace?.name || 'Dashboard', [currentWorkspace]);

  const handleSwitchWorkspace = () => {
    // Возвращаемся к выбору воркспейса, сбрасывая текущий выбор
    // Это приведет к переходу на select состояние в WorkspaceStateRouter
    actions.setCurrentWorkspace(null);
  };

  if (!currentWorkspace) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground">
              {currentWorkspace.description || 'Manage your tasks and projects'}
            </p>
          </div>
          {workspaces.length > 1 && (
            <Button variant="outline" onClick={handleSwitchWorkspace}>
              Switch Workspace
            </Button>
          )}
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
              <div className="text-2xl font-bold mb-2">{currentWorkspace.ownerId}</div>
              <p className="text-sm text-muted-foreground">Workspace owner</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{currentWorkspace.ownerId}</div>
            <p className="text-sm text-muted-foreground">Workspace owner</p>
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
                <span className="text-sm text-muted-foreground">{currentWorkspace.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(currentWorkspace.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Updated:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(currentWorkspace.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
              <p className="text-sm mt-2">Start by creating your first task or project</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
              <p className="text-sm mt-2">Start by creating your first task or project</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
