'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { WorkspaceContent, WorkspaceManageContent } from '@/features/workspace/content';
import { useWorkspaces } from '@/features/workspace/model/queries';
import { useHeaderFromTemplate } from '@/shared/ui';

/**
 * Workspace Screen
 * Обертка по паттерну todos
 */
export function WorkspaceScreen() {
  useHeaderFromTemplate(null, 'todos');
  return <WorkspaceContent />;
}

/**
 * Workspace Hub Screen
 * Клиентская логика редиректа на основе доступных workspace
 */
export function WorkspaceHubScreen() {
  const router = useRouter();
  const { workspaces, isLoading } = useWorkspaces();

  useHeaderFromTemplate(null, 'todos');

  useEffect(() => {
    // Если загрузка завершена и есть workspace
    if (!isLoading && workspaces.length > 0) {
      // Находим default workspace или первый
      const defaultWorkspace = workspaces.find((w) => w.isDefault) || workspaces[0];

      if (defaultWorkspace) {
        // Редирект на time-entry страницу workspace
        router.push(`/tracker/${defaultWorkspace.id}/time-entry`);
      }
    }

    // Если нет workspace, можно показать UI для создания
    // или редирект на onboarding страницу
  }, [workspaces, isLoading, router]);

  // Показываем загрузку или UI для создания workspace
  if (isLoading) {
    return <div>Loading workspace...</div>;
  }

  if (workspaces.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Welcome to Tracker</h1>
          <p>Create your first workspace to start tracking time</p>
          {/* Здесь можно добавить форму создания workspace */}
        </div>
      </div>
    );
  }

  return <div>Redirecting to your workspace...</div>;
}

/**
 * Workspace Manage Screen
 * Полный список workspace для управления
 */
export function WorkspaceManageScreen() {
  useHeaderFromTemplate(null, 'todos');
  return <WorkspaceManageContent />;
}
