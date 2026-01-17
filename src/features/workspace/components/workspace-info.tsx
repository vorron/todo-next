'use client';

import { Card, CardContent } from '@/shared/ui';

import { formatDate } from '../lib/workspace-management';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceInfoProps {
  workspace: Workspace;
  className?: string;
}

export function WorkspaceInfo({ workspace, className }: WorkspaceInfoProps) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">ID:</span>
            <span className="text-sm text-muted-foreground">{workspace.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Created:</span>
            <span className="text-sm text-muted-foreground">{formatDate(workspace.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Updated:</span>
            <span className="text-sm text-muted-foreground">{formatDate(workspace.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
