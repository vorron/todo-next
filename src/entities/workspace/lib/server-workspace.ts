import { type Workspace } from '@/entities/workspace/model/schema';

/**
 * Server-side функции для workspace
 * Используются для начального server-side редиректа
 */

// Конфигурация для demo режима
const DEMO_WORKSPACES: Workspace[] = [
  {
    id: 'w2',
    name: 'Team Workspace',
    description: 'Main team workspace',
    isDefault: true,
    ownerId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '63e6',
    name: 'Personal Workspace',
    description: 'Personal projects',
    isDefault: true,
    ownerId: '4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
] as const;

export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  try {
    // В реальном приложении здесь будет запрос к БД или API
    if (process.env.NODE_ENV === 'development') {
      // Demo режим только в development
      return DEMO_WORKSPACES.filter((w) => w.ownerId === userId);
    }

    // Production: реальный запрос к API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/workspaces?ownerId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch workspaces');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return [];
  }
}

export function getDefaultWorkspace(workspaces: Workspace[]): Workspace | null {
  return workspaces.find((w) => w.isDefault) || workspaces[0] || null;
}
