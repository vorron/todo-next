/**
 * Workspace Management Library
 * Бизнес-логика для управления workspace без UI
 */

import { ROUTES } from '@/shared/lib/router';

import type { Workspace } from '@/entities/workspace/model/schema';

export interface WorkspaceActions {
  goToManage: () => string;
  goToSelect: () => string;
  goToReports: (id: string) => string;
  goToProjects: (id: string) => string;
  goToTimeEntry: (id: string) => string;
}

/**
 * Создает объект с действиями для workspace
 */
export function createWorkspaceActions(router: { push: (path: string) => void }): WorkspaceActions {
  return {
    goToManage: () => {
      const path = ROUTES.TRACKER_MANAGE;
      router.push(path);
      return path;
    },
    goToSelect: () => {
      const path = ROUTES.TRACKER_SELECT;
      router.push(path);
      return path;
    },
    goToReports: (id: string) => {
      const path = ROUTES.WORKSPACE_REPORTS(id);
      router.push(path);
      return path;
    },
    goToProjects: (id: string) => {
      const path = ROUTES.WORKSPACE_PROJECTS(id);
      router.push(path);
      return path;
    },
    goToTimeEntry: (id: string) => {
      const path = ROUTES.WORKSPACE_TIME_ENTRY(id);
      router.push(path);
      return path;
    },
  };
}

/**
 * Форматирует дату для отображения
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

/**
 * Проверяет, является ли workspace default
 */
export function isDefaultWorkspace(workspace: Workspace): boolean {
  return workspace.isDefault;
}

/**
 * Получает отображаемое имя workspace
 */
export function getWorkspaceDisplayName(workspace: Workspace): string {
  return workspace.name || 'Untitled Workspace';
}
