import { projectApi } from '@/entities/project';

import type { Project } from '@/entities/project';

export function useProjects() {
  return projectApi.endpoints.getProjects.useQuery();
}

export type { Project };
