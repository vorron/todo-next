export interface Project {
  id: string;
  name: string;
  description?: string;
  config: {
    color: string;
    icon?: string;
    sortOrder?: number;
    isPinned?: boolean;
  };
  isActive: boolean;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}
