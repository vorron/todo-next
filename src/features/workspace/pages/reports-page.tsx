'use client';

import { useRouter } from 'next/navigation';

import { ROUTES } from '@/shared/lib/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { Button } from '@/shared/ui/button';

import type { Workspace } from '@/entities/workspace/model/schema';

/**
 * Reports Page
 * Аналитика и отчеты по workspace
 */
export function ReportsPage({ workspace }: { workspace: Workspace }) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{workspace.name} - Reports</h1>
        <p className="text-muted-foreground">Analytics and insights for {workspace.name}</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
        <Button onClick={() => router.push(ROUTES.WORKSPACE_MANAGE)}>Switch Workspace</Button>
        <Button onClick={() => router.push(ROUTES.WORKSPACE_TIME_ENTRY(workspace.id))}>
          Time Entry
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Time Tracking Report */}
        <Card>
          <CardHeader>
            <CardTitle>Time Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-2xl font-bold mb-2">0h 0m</div>
              <p className="text-muted-foreground">Total time this week</p>
              <Button className="mt-4" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-2xl font-bold mb-2">0/5</div>
              <p className="text-muted-foreground">Tasks completed</p>
              <Button className="mt-4" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-2xl font-bold mb-2">12</div>
              <p className="text-muted-foreground">Activities today</p>
              <Button className="mt-4" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Productivity */}
        <Card>
          <CardHeader>
            <CardTitle>Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-2xl font-bold mb-2">85%</div>
              <p className="text-muted-foreground">Efficiency score</p>
              <Button className="mt-4" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-2xl font-bold mb-2">$0</div>
              <p className="text-muted-foreground">This month</p>
              <Button className="mt-4" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-2xl font-bold mb-2">3</div>
              <p className="text-muted-foreground">Saved reports</p>
              <Button className="mt-4" variant="outline">
                Create New
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
