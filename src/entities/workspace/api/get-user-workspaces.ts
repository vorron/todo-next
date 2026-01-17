import { env } from '@/shared/config/env';

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
    // Используем унифицированную конфигурацию URL
    const response = await fetch(`${env.NESTJS_API_URL}/workspaces/owner/${userId}`, {
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
