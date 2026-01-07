import { WorkspaceDashboardPage } from '@/features/workspace/pages';
import { parseSlugId } from '@/shared/lib/utils/slug-id';

import type { Workspace } from '@/entities/workspace/model/schema';

type WorkspaceParams = { id: string };

export default async function Page({ params }: { params: Promise<WorkspaceParams> }) {
  const { id } = await params;
  const { workspaceId } = parseSlugId(id);

  // Временный хардкод до API
  const workspaceData: Record<string, Workspace> = {
    w2: {
      id: 'w2',
      name: 'Team Workspace',
      ownerId: '1',
      isDefault: true,
      createdAt: '2026-01-01T08:00:00.000Z',
      updatedAt: '2026-01-01T08:00:00.000Z',
    },
    '63e6': {
      id: '63e6',
      name: 'Тестовое пространстово',
      description: 'Тестовое пространстово для тестирования',
      ownerId: '4',
      isDefault: false,
      createdAt: '2026-01-06T07:44:08.012Z',
      updatedAt: '2026-01-06T07:44:08.012Z',
    },
  };

  const workspace = workspaceData[workspaceId] || {
    id: workspaceId || 'unknown',
    name: `Workspace ${workspaceId}`,
    description: 'Default workspace description',
    ownerId: 'temp',
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return <WorkspaceDashboardPage workspace={workspace} />;
}
