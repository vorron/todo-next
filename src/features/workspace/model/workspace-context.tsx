'use client';

import { createContext, useContext } from 'react';

import type { WorkspaceState } from './hooks/use-workspace-state';

export const WorkspaceContext = createContext<WorkspaceState | null>(null);

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaceContext must be used within WorkspaceProvider');
  }
  return context;
}

export interface WorkspaceProviderProps {
  children: React.ReactNode;
  value: WorkspaceState;
}

export function WorkspaceProvider({ children, value }: WorkspaceProviderProps) {
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
