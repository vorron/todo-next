/**
 * Workspace Entity Exports
 * Централизованные экспорты для сущности Workspace
 */

// Types
export type { Workspace, WorkspaceUser } from './model/schema';

// API
export {
  workspaceApi,
  workspaceApiEndpoints,
  workspaceApiUtil,
  workspaceApiReducerPath,
  workspaceApiReducer,
  workspaceApiMiddleware,
} from './api/workspace-api';

// Server-side functions
export { getUserWorkspaces, getDefaultWorkspace, getWorkspaceById } from './lib/server-workspace';
