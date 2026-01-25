import { ApiError } from '@/shared/api/client';

import type { Workspace } from '@/entities/workspace/model/schema';

/**
 * Workspace API endpoints for server-side usage
 * Direct calls to Nest.js backend
 */

class ServerWorkspaceApi {
  private baseUrl = 'http://localhost:3001/api';

  private async safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, response.statusText, errorData);
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Network error occurred');
    }
  }

  async getWorkspaces(userId: string): Promise<Workspace[]> {
    return this.safeFetch<Workspace[]>(`${this.baseUrl}/workspaces?ownerId=${userId}`);
  }

  async getWorkspaceById(id: string): Promise<Workspace | null> {
    try {
      return await this.safeFetch<Workspace>(`${this.baseUrl}/workspaces/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createWorkspace(
    data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Workspace> {
    return this.safeFetch<Workspace>(`${this.baseUrl}/workspaces`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const workspaceApi = new ServerWorkspaceApi();

// Type exports
export type WorkspaceCreateRequest = Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>;
export type WorkspaceUpdateRequest = Partial<WorkspaceCreateRequest>;
