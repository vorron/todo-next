'use client';

import { useRouter } from 'next/navigation';

import { slugify } from '@/shared/lib/utils/slugify';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceTimeEntryPageProps {
  workspace: Workspace | null;
}

/**
 * Enhanced Time Entry Page
 * Работает с пропсами и улучшенным DX
 */
export function WorkspaceTimeEntryPage({ workspace }: WorkspaceTimeEntryPageProps) {
  const router = useRouter();
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{workspace.name}</h1>
          <p className="text-muted-foreground">Time tracking workspace</p>
        </div>
        <div className="flex gap-2">
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
      </div>

      <div className="grid gap-6">
        {/* Time Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Start Timer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Time entry functionality coming soon</p>
              <p className="text-sm mt-2">This will be the main time tracking interface</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
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
              <Button
                variant="outline"
                className="h-20"
                onClick={() => router.push(`/tracker/${slugify(workspace.name)}-${workspace.id}`)}
              >
                <div className="text-center">
                  <div className="text-lg">⚙️</div>
                  <div className="text-sm">Dashboard</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workspace Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current Workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Name:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{workspace.name}</span>
                  {workspace.isDefault && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
              </div>
              {workspace.description && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Description:</span>
                  <span className="text-sm text-muted-foreground">{workspace.description}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(workspace.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Direct URL:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  /workspace/{workspace.id}/time
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
