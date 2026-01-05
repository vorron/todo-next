// Используем общие типы из shared/lib/router
import type { StatefulNavigation } from '@/shared/lib/router/config-types';

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members: WorkspaceMember[];
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export type WorkspaceState = {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
};

// === Workspace Routing Types ===
export type WorkspaceRouteStates = {
  loading: Record<string, never>;
  create: Record<string, never>;
  select: Record<string, never>;
  dashboard: { workspaceId: string };
};

export type WorkspaceRouteState = {
  key: keyof WorkspaceRouteStates;
  data?: WorkspaceRouteStates[keyof WorkspaceRouteStates];
};

export type WorkspaceNavigation = StatefulNavigation<{ workspaceId?: string }>;

export type WorkspaceAction =
  | { type: 'SET_WORKSPACES'; payload: Workspace[] }
  | { type: 'SET_CURRENT_WORKSPACE'; payload: Workspace | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_WORKSPACE'; payload: Workspace }
  | { type: 'UPDATE_WORKSPACE'; payload: { id: string; updates: Partial<Workspace> } }
  | { type: 'REMOVE_WORKSPACE'; payload: string };
