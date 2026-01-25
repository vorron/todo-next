import { workspaceApi } from '@/entities/workspace';

export function useWorkspaces() {
  return workspaceApi.endpoints.getWorkspaces.useQuery();
}

export function useWorkspacesByOwner(ownerId: string) {
  return workspaceApi.endpoints.getWorkspacesByOwner.useQuery(ownerId);
}

export function useWorkspaceById(id: string) {
  return workspaceApi.endpoints.getWorkspaceById.useQuery(id);
}
