'use client';

import { statefulRouteConfigData } from '@/shared/lib/router';
import { StateRouter } from '@/shared/lib/router/state-router';
import { DataErrorState, DataLoadingState } from '@/shared/ui';

import { workspaceComponents } from './workspace-components';
import { useWorkspaceState } from '../model/hooks/use-workspace-state';
import { WorkspaceProvider } from '../model/workspace-context';

/**
 * Workspace-специфичный роутер состояний
 */
export function WorkspaceStateRouter() {
  const workspaceState = useWorkspaceState();

  if (workspaceState.isLoading) {
    return <DataLoadingState message="Loading workspace..." />;
  }

  if (workspaceState.error) {
    return (
      <DataErrorState description="Failed to load workspaces" onRetry={workspaceState.refetch} />
    );
  }

  return (
    <WorkspaceProvider value={workspaceState}>
      <StateRouter
        currentState={workspaceState.workspaceType}
        componentMap={workspaceComponents}
        statefulConfig={statefulRouteConfigData.workspace}
        currentItem={workspaceState.currentWorkspace}
        suspenseFallback={<div>Loading workspace...</div>}
      />
    </WorkspaceProvider>
  );
}
