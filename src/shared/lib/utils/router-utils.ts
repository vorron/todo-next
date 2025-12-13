import { ROUTE_CONFIG } from '@/shared/config/router-config';

// Хелпер для получения metadata (только для статических маршрутов)
export function getRouteMetadata(path: string) {
  return ROUTE_CONFIG[path as keyof typeof ROUTE_CONFIG]?.metadata;
}

// Получение конфига по пути
export function getRouteConfig(path: string) {
  return ROUTE_CONFIG[path as keyof typeof ROUTE_CONFIG];
}
