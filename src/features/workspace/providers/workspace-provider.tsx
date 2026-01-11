'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { useWorkspaces } from '../model/queries';

import type { Workspace } from '@/entities/workspace/model/schema';

interface WorkspaceContextValue {
  workspaces: Workspace[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

interface WorkspaceProviderProps {
  children: ReactNode;
}

/**
 * Provider для workspace состояния
 * Предоставляет данные о воркспейсах всему дереву компонентов
 */
export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const { workspaces, isLoading, error, refetch } = useWorkspaces();

  const value: WorkspaceContextValue = {
    workspaces: workspaces || [],
    isLoading,
    error,
    refetch,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

/**
 * Hook для доступа к workspace контексту
 */
export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspaceContext must be used within WorkspaceProvider');
  }

  return context;
}
