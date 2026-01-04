export interface TimeEntry {
  id: string;

  startTime: string;
  endTime?: string;
  duration?: number;
  description?: string;
  billable: boolean;
  tags?: string[];

  taskId: string;
  userId: string;

  createdAt: string;
  updatedAt: string;
}
