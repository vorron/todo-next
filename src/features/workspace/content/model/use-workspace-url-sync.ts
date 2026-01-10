/**
 * Workspace URL Sync Hook
 * Синхронизация состояния с URL по паттерну todos
 */

import { useEffect, useRef, useState } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { ROUTES } from '@/shared/lib/router';

import type { WorkspaceViewState } from './use-workspace-state';

/**
 * Синхронизирует workspace состояние с URL
 * Автоматические редиректы и поддержание консистентности
 */
export function useWorkspaceUrlSync(workspaceState: WorkspaceViewState) {
  const router = useRouter();
  const pathname = usePathname();
  // const params = useParams(); // Не используется

  const { workspaces, currentWorkspace, isLoading, workspaceId } = workspaceState;

  const isInitialLoad = useRef(true);
  const isRedirecting = useRef(false);
  const [isRedirectingState, setIsRedirectingState] = useState(false);

  // Auto-redirect logic
  useEffect(() => {
    if (isLoading || isRedirecting.current) return;

    // Case 1: No workspaces → create
    if (workspaces.length === 0) {
      isRedirecting.current = true;
      router.push(ROUTES.WORKSPACE_SELECT);
      setTimeout(() => setIsRedirectingState(true), 0);
      return;
    }

    // Case 2: Main workspace page with no ID → redirect to default
    if (!workspaceId) {
      const defaultWorkspace = workspaces.find((w) => w.isDefault) || workspaces[0];
      if (defaultWorkspace) {
        isRedirecting.current = true;
        setTimeout(() => setIsRedirectingState(true), 0);
        router.push(`/tracker/${defaultWorkspace.id}/time-entry`);
        return;
      } else {
        isRedirecting.current = true;
        setTimeout(() => setIsRedirectingState(true), 0);
        router.push(ROUTES.WORKSPACE_SELECT);
        return;
      }
    }

    // Case 3: Invalid workspace ID → redirect to select
    if (workspaceId && !currentWorkspace) {
      isRedirecting.current = true;
      setTimeout(() => setIsRedirectingState(true), 0);
      router.push(ROUTES.WORKSPACE_SELECT);
      return;
    }

    isInitialLoad.current = false;
    setTimeout(() => setIsRedirectingState(false), 0);
  }, [workspaces, workspaceId, currentWorkspace, isLoading, router]);

  // Track pathname changes
  useEffect(() => {
    if (pathname !== '/workspace' && isRedirecting.current) {
      isRedirecting.current = false;
      setTimeout(() => setIsRedirectingState(false), 0);
    }
  }, [pathname]);

  return {
    isLoading: isRedirectingState,
    error: isRedirectingState ? 'Redirecting...' : null,
    refetch: () => {
      isRedirecting.current = false;
      isInitialLoad.current = true;
      setIsRedirectingState(false);
    },
  };
}
