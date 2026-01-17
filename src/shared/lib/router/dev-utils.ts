import { navigationConfig } from './generators';
import { ROUTES } from './index';
import { validateRouteConfig } from './validation';

/**
 * Developer utilities для роутинга
 * Улучшение DX при разработке
 */

/**
 * Получение информации о маршруте по ключу
 */
export function getRouteInfo(routeKey: keyof typeof ROUTES) {
  const route = ROUTES[routeKey];
  const navConfig = navigationConfig[routeKey as keyof typeof navigationConfig];

  return {
    path: route,
    key: routeKey,
    navigation: navConfig,
    isStateful: false,
  };
}

/**
 * Поиск маршрута по пути
 */
export function findRouteByPath(path: string): keyof typeof ROUTES | null {
  for (const [key, routePath] of Object.entries(ROUTES)) {
    if (typeof routePath === 'string' && routePath === path) {
      return key as keyof typeof ROUTES;
    }
    if (typeof routePath === 'function') {
      // Для динамических путей проверяем базовый паттерн
      const basePattern = path.split(':')[0];
      if (basePattern && path.startsWith(basePattern)) {
        return key as keyof typeof ROUTES;
      }
    }
  }
  return null;
}

/**
 * Получение всех защищенных маршрутов
 */
export function getProtectedRoutes() {
  return Object.entries(navigationConfig)
    .filter(([_, config]) => config.requiresAuth)
    .map(([key, config]) => ({
      key,
      path: config.href,
      label: config.label,
    }));
}

/**
 * Получение всех публичных маршрутов
 */
export function getPublicRoutes() {
  return Object.entries(navigationConfig)
    .filter(([_, config]) => !config.requiresAuth)
    .map(([key, config]) => ({
      key,
      path: config.href,
      label: config.label,
    }));
}

/**
 * Валидация роутинга с детальной информацией
 */
export function debugRouting() {
  const validation = validateRouteConfig();
  return validation;
}

/**
 * Генератор путей для разработки
 * Автоматически генерирует все пути из ROUTES
 */
export function createPathGenerator() {
  // Разделяем статические и динамические маршруты
  const staticRoutes: Record<string, string> = {};
  const dynamicRoutes: Record<string, (id: string) => string> = {};
  const statefulRoutes: Record<string, string> = {};

  Object.entries(ROUTES).forEach(([key, route]) => {
    if (typeof route === 'string') {
      staticRoutes[key] = route;
    } else if (typeof route === 'function') {
      dynamicRoutes[key] = (id: string) => route(id);
    }
  });

  // Добавляем stateful маршруты из ROUTES (автоматически)
  Object.entries(ROUTES).forEach(([key, route]) => {
    if (
      typeof route === 'string' &&
      (key.includes('CREATE') || key.includes('SELECT') || key.includes('DASHBOARD'))
    ) {
      statefulRoutes[key] = route;
    }
  });

  return {
    // Все статические пути
    static: staticRoutes,

    // Все динамические пути
    dynamic: dynamicRoutes,

    // Stateful пути
    stateful: statefulRoutes,
  };
}

/**
 * Утилита для тестирования роутов
 */
export function createRouteTester() {
  const testRoute = (path: string) => {
    const routeKey = findRouteByPath(path);
    if (!routeKey) {
      return { found: false, path };
    }

    const routeInfo = getRouteInfo(routeKey);
    return {
      found: true,
      path,
      key: routeKey,
      info: routeInfo,
    };
  };

  return {
    test: testRoute,
    testAll: () =>
      Object.values(ROUTES)
        .map((route) => (typeof route === 'string' ? testRoute(route) : null))
        .filter(Boolean),
  };
}

/**
 * Development shortcuts - только для development режима
 * Не включается в production сборку
 */
export const devShortcuts =
  process.env.NODE_ENV === 'development'
    ? {
        debug: () => debugRouting(),
        validate: () => validateRouteConfig(),
      }
    : null;
