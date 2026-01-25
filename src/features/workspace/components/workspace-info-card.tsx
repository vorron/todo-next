import { Card, CardContent } from '@/shared/ui';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceInfoCardProps {
  workspace: Workspace;
}

export function WorkspaceInfoCard({ workspace }: WorkspaceInfoCardProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent>
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
  );
}
