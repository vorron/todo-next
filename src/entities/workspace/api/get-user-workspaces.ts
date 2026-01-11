import type { Workspace } from '../model/schema';

/**
 * Server-side функция получения воркспейсов пользователя
 * Теперь использует NestJS API endpoint
 */

// Тип для API response
interface ApiWorkspace {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  try {
    // Используем NestJS API endpoint - baseUrl уже включает /api
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    const response = await fetch(`${baseUrl}/workspaces/owner/${userId}`, {
      cache: 'no-store', // Всегда свежие данные для layout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const workspaces = (await response.json()) as ApiWorkspace[];

    // Конвертируем в формат Next.js
    return workspaces.map((ws: ApiWorkspace) => ({
      id: ws.id,
      name: ws.name,
      description: ws.description || null,
      ownerId: ws.ownerId,
      isDefault: ws.isDefault || false,
      createdAt: ws.createdAt,
      updatedAt: ws.updatedAt,
    }));
  } catch {
    return [];
  }
}
