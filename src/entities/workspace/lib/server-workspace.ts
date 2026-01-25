import { workspaceApi } from '@/entities/workspace/api/workspace-server-api';
import { type Workspace } from '@/entities/workspace/model/schema';

/**
 * Server-side функции для workspace
 * Используют централизованный API клиент с кэшированием
 */

export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  try {
    return await workspaceApi.getWorkspaces(userId);
  } catch (error) {
    console.error('Failed to fetch workspaces:', error);
    return [];
  }
}

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  try {
    return await workspaceApi.getWorkspaceById(id);
  } catch (error) {
    console.error('Failed to fetch workspace:', error);
    return null;
  }
}

export function findDefaultWorkspace(workspaces: Workspace[]): Workspace | null {
  return workspaces.find((w) => w.isDefault) || workspaces[0] || null;
}
