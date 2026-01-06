/**
 * Workspace Types
 * Типы для сущности Workspace
 */

// export interface Workspace {
//   id: string;
//   name: string;
//   description?: string;
//   createdAt: string;
//   updatedAt: string;
//   members: WorkspaceMember[];
// }

// export interface WorkspaceMember {
//   id: string;
//   userId: string;
//   role: 'owner' | 'admin' | 'member';
//   joinedAt: string;
// }

export type { Workspace } from './schema';
export type { WorkspaceUser } from './schema';
