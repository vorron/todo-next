'use client';

import { BarChart, Folder, Settings } from 'lucide-react';

import { useNavigation } from '@/shared/lib/router';
import {
  UniversalActionBar,
  ACTION_DIVIDER,
  type UniversalActionItem,
} from '@/shared/ui/universal-action-bar';

import type { Workspace } from '@/entities/workspace/model/schema';

interface WorkspaceActionsBarProps {
  workspaces: Workspace[];
  currentWorkspaceId?: string;
  className?: string;
}

/**
 * Workspace Actions Bar с истинно декларативным подходом
 *
 * Features:
 * - 0 custom render функций
 * - Полностью декларативная конфигурация
 * - Максимальный DX без бойлерплейта
 * - 100% сохранение функциональности и внешнего вида
 */
export function WorkspaceActionsBar({
  workspaces,
  currentWorkspaceId,
  className,
}: WorkspaceActionsBarProps) {
  const navigation = useNavigation();

  const actions: UniversalActionItem[] = [
    {
      key: 'workspace-switcher',
      type: 'switcher',
      switcherConfig: {
        items: workspaces,
        idField: 'id',
        labelField: 'name',
        onSelect: (selectedWorkspace) => {
          navigation.toWorkspaceTimeEntry(selectedWorkspace.id);
        },
        actions: [
          {
            key: 'create',
            label: 'Create New Workspace',
            icon: 'Plus',
            onClick: () => navigation.toWorkspaceManage(),
          },
          {
            key: 'manage',
            label: 'Manage Workspaces',
            icon: 'Settings',
            onClick: () => navigation.toWorkspaceManage(),
            divider: true,
          },
        ],
      },
    },
    ACTION_DIVIDER,
    // Стандартные кнопки действий
    {
      key: 'reports',
      icon: <BarChart className="h-5 w-5" />,
      label: 'Reports',
      title: 'View time reports',
      onClick: () => currentWorkspaceId && navigation.toWorkspaceReports(currentWorkspaceId),
      disabled: !currentWorkspaceId,
    },
    {
      key: 'projects',
      icon: <Folder className="h-5 w-5" />,
      label: 'Projects',
      title: 'Manage projects',
      onClick: () => currentWorkspaceId && navigation.toWorkspaceProjects(currentWorkspaceId),
      disabled: !currentWorkspaceId,
    },
    {
      key: 'dashboard',
      icon: <Settings className="h-5 w-5" />,
      label: 'Dashboard',
      title: 'Go to workspace dashboard',
      onClick: () => currentWorkspaceId && navigation.toWorkspaceDashboard(currentWorkspaceId),
      disabled: !currentWorkspaceId,
    },
  ];

  return (
    <UniversalActionBar
      actions={actions}
      size="md"
      align="center"
      ariaLabel="Workspace actions"
      className={className}
    />
  );
}
