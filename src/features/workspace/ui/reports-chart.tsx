'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface ReportsChartProps {
  workspace: Workspace;
}

export function ReportsChart({ workspace }: ReportsChartProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">Analytics and insights for {workspace.name}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Time Tracking Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Reports Coming Soon</h3>
              <p className="text-muted-foreground">
                Advanced analytics and reporting features will be available here
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0h</div>
                <p className="text-sm text-muted-foreground">Total Time Tracked</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <p className="text-sm text-muted-foreground">Completed Tasks</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
