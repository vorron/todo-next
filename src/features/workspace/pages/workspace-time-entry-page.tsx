'use client';

import { Clock } from 'lucide-react';

import { WorkspaceActionsBar } from '@/features/workspace/components';
import { Card, CardContent, CardHeader } from '@/shared/ui';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceTimeEntryPageProps {
  workspace: Workspace;
  workspaces: Workspace[];
}

export function TimeEntryPage({ workspace, workspaces }: WorkspaceTimeEntryPageProps) {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <WorkspaceActionsBar workspaces={workspaces} currentWorkspaceId={workspace?.id} />

      {/* Основной блок таймера - фокус на действии */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Start Timer</h2>
          <p className="text-muted-foreground">Track your time efficiently</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Заглушка таймера - временно */}
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Timer functionality coming soon</p>
            <p className="text-sm text-gray-500 mt-2">
              This will be the main time tracking interface
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Информация о workspace - минимизированная */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm gap-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Workspace:</span>
              <span className="font-medium">{workspace.name}</span>
              {workspace.isDefault && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
              )}
            </div>
            <div className="text-muted-foreground">ID: {workspace.id}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
