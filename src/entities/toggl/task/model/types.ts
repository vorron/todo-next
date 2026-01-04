export interface Task {
  id: string;

  description: string;
  createdBy: string;
  tags?: string[];
  isActive: boolean;
  estimatedDuration?: number;

  projectId: string;
  userId?: string;

  createdAt: string;
  updatedAt: string;
}
