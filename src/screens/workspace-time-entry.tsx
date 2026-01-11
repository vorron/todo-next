'use client';

import { useWorkspaces } from '@/features/workspace/model/queries';
import { WorkspaceTimeEntryPage as WorkspaceTimeEntryComponent } from '@/features/workspace/pages';

/**
 * Workspace Time Entry Screen
 * Обертка для client component с загрузкой данных
 */
export function WorkspaceTimeEntryPage({ params }: { params: { id: string } }) {
  const { workspaces, isLoading } = useWorkspaces();

  if (isLoading) {
    return <div>Loading workspace...</div>;
  }

  const workspace = workspaces.find((w) => w.id === params.id) || null;

  return <WorkspaceTimeEntryComponent workspace={workspace} />;
}
