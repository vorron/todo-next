/**
 * Workspace State Router - использует универсальный StateRouter
 * Конфигурация состояний остается в feature
 */

'use client';

import { useWorkspaceNavigation, useWorkspaceType } from '@/entities/workspace';
import { StateRouter } from '@/shared/lib/router/state-router';

import { workspaceStatesConfig, type WorkspaceStateKey } from '../config/workspace-states';

/**
 * Workspace-специфичный роутер состояний
 */
export function WorkspaceStateRouter() {
  const workspaceType = useWorkspaceType();
  const { title, breadcrumbs } = useWorkspaceNavigation();

  return (
    <StateRouter
      currentState={workspaceType as WorkspaceStateKey}
      configs={workspaceStatesConfig}
      title={title}
      breadcrumbs={breadcrumbs}
      fallbackComponent={workspaceStatesConfig.loading.component}
    />
  );
}
