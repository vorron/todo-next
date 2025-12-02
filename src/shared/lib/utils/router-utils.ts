import { ROUTE_CONFIG } from '@/shared/config/router-config';

// // Автоматически генерируем защищенные маршруты
// export const PROTECTED_ROUTES = Object.entries(ROUTE_CONFIG)
//     .filter(([_, config]) => config.isProtected)
//     .map(([path]) => path as string);

// export const PUBLIC_ROUTES = Object.entries(ROUTE_CONFIG)
//     .filter(([_, config]) => !config.isProtected)
//     .map(([path]) => path as string);

// Хелпер для получения metadata (только для статических маршрутов)
export function getRouteMetadata(path: string) {
  return ROUTE_CONFIG[path as keyof typeof ROUTE_CONFIG]?.metadata;
}

// Проверка защищенности маршрута
// export function isProtectedRoute(path: string): boolean {
//     return PROTECTED_ROUTES.includes(path);
// }

// Получение конфига по пути
export function getRouteConfig(path: string) {
  return ROUTE_CONFIG[path as keyof typeof ROUTE_CONFIG];
}
