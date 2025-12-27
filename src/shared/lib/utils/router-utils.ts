import { getStaticMetadata } from '@/shared/config/routes';

import type { Metadata } from 'next';

// Хелпер для получения metadata (только для статических маршрутов)
export function getRouteMetadata(path: string): Metadata {
  return getStaticMetadata(path) ?? {};
}

// Получение конфига по пути
export function getRouteConfig(path: string): { metadata: Metadata } | undefined {
  const metadata = getStaticMetadata(path);

  if (!metadata) return undefined;

  return {
    metadata,
  };
}
