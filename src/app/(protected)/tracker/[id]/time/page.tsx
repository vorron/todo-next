import { WorkspaceTimeEntryPage } from '@/features/workspace/pages';

import type { Workspace } from '@/entities/workspace/model/schema';

type WorkspaceTimeParams = { id: string };

export default async function Page({ params }: { params: Promise<WorkspaceTimeParams> }) {
  const { id } = await params;

  // Для time entry нужно получить workspace данные
  // В реальном приложении здесь будет запрос к API
  const workspace: Workspace = {
    id,
    name: 'Workspace',
    isDefault: false,
    ownerId: 'temp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }; // Временное решение

  return <WorkspaceTimeEntryPage workspace={workspace} />;
}
