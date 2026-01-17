'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface DashboardCardsProps {
  workspace: Workspace;
  className?: string;
}

export function DashboardCards({ workspace, className }: DashboardCardsProps) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
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
          <div className="text-2xl font-bold mb-2">{workspace.ownerId}</div>
          <p className="text-sm text-muted-foreground">Workspace owner</p>
        </CardContent>
      </Card>
    </div>
  );
}
