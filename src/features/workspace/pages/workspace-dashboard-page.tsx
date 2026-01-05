'use client';

import { useWorkspaceState, useWorkspaceNavigation } from '@/entities/workspace';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/shared/ui';

export function WorkspaceDashboardPage() {
  const { currentWorkspace, workspaces, setCurrentWorkspace } = useWorkspaceState();
  const { title } = useWorkspaceNavigation();

  const handleSwitchWorkspace = () => {
    // В реальном приложении здесь был бы переход к выбору воркспейса
    setCurrentWorkspace(null);
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
              <CardTitle className="text-lg">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{currentWorkspace.members.length}</div>
              <p className="text-sm text-muted-foreground">Total members</p>
            </CardContent>
          </Card>
        </div>

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
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentWorkspace.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">User {member.userId}</div>
                    <div className="text-sm text-muted-foreground">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
