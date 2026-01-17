import { api } from '@/shared/api/client';

import type { Workspace } from '@/entities/workspace/model/schema';

/**
 * Workspace API endpoints
 * Type-safe API calls with proper caching strategies
 */

export const workspaceApi = {
  // Get all workspaces for a user (cached)
  getWorkspaces: (userId: string): Promise<Workspace[]> =>
    api.cached.get<Workspace[]>(`/workspaces?ownerId=${userId}`, 300),

  // Get specific workspace (tagged for cache invalidation)
  getWorkspaceById: (id: string): Promise<Workspace | null> =>
    api.cached.tagged<Workspace>(`/workspaces/${id}`, ['workspace', `workspace-${id}`]),

  // Create new workspace (no cache)
  createWorkspace: (data: WorkspaceCreateRequest): Promise<Workspace> =>
    api.create<Workspace>('/workspaces', data),

  // Update workspace (invalidates cache)
  updateWorkspace: (id: string, data: WorkspaceUpdateRequest): Promise<Workspace> =>
    api.update<Workspace>(`/workspaces/${id}`, data),

  // Delete workspace (invalidates cache)
  deleteWorkspace: (id: string): Promise<void> => api.remove<void>(`/workspaces/${id}`),

  // Get fresh data (bypass cache)
  getFreshWorkspaces: (userId: string): Promise<Workspace[]> =>
    api.fresh.get<Workspace[]>(`/workspaces?ownerId=${userId}`),
};

// Type exports
export type WorkspaceCreateRequest = Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>;
export type WorkspaceUpdateRequest = Partial<WorkspaceCreateRequest>;
