'use client';

import { WorkspaceContent } from '@/features/workspace/content';
import { WorkspaceHubContent } from '@/features/workspace/content/workspace-hub-content';
import { WorkspaceManageContent } from '@/features/workspace/content/workspace-manage-content';
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
 * Overview всех workspace + smart actions
 */
export function WorkspaceHubScreen() {
  useHeaderFromTemplate(null, 'todos');
  return <WorkspaceHubContent />;
}

/**
 * Workspace Manage Screen
 * Полный список workspace для управления
 */
export function WorkspaceManageScreen() {
  useHeaderFromTemplate(null, 'todos');
  return <WorkspaceManageContent />;
}
