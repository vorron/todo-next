export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}
