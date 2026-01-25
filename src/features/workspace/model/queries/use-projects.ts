import { projectApi } from '@/entities/project';

export function useProjects() {
  return projectApi.endpoints.getProjects.useQuery();
}

export function useProjectById(id: string) {
  return projectApi.endpoints.getProjectById.useQuery(id);
}
