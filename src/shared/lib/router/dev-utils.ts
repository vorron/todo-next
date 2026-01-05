import { navigationConfig, statefulNavigationConfig } from './generators';
import { validateRouteConfig } from './validation';
import { ROUTES } from '../../config/router-config';

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
  const statefulNavConfig =
    statefulNavigationConfig[routeKey as keyof typeof statefulNavigationConfig];

  return {
    path: route,
    key: routeKey,
    navigation: navConfig || statefulNavConfig,
    isStateful: !!statefulNavConfig,
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
  console.group('🔍 Router Debug Information');

  // Валидация конфигурации
  const validation = validateRouteConfig();
  if (validation.isValid) {
    console.log('✅ Route configuration is valid');
  } else {
    console.error('❌ Route configuration errors:', validation.errors);
  }

  // Статистика маршрутов
  console.log('📊 Route Statistics:');
  console.log(`- Total routes: ${Object.keys(ROUTES).length}`);
  console.log(
    `- Static routes: ${Object.entries(ROUTES).filter(([_, path]) => typeof path === 'string').length}`,
  );
  console.log(
    `- Dynamic routes: ${Object.entries(ROUTES).filter(([_, path]) => typeof path === 'function').length}`,
  );
  console.log(`- Protected routes: ${getProtectedRoutes().length}`);
  console.log(`- Public routes: ${getPublicRoutes().length}`);

  // Stateful маршруты
  const statefulCount = Object.keys(statefulNavigationConfig).length;
  if (statefulCount > 0) {
    console.log(`- Stateful routes: ${statefulCount}`);
    Object.entries(statefulNavigationConfig).forEach(([key, config]) => {
      console.log(`  - ${key}: ${Object.keys(config.states).length} states`);
    });
  }

  console.groupEnd();

  return validation;
}

/**
 * Генератор путей для разработки
 */
export function createPathGenerator() {
  return {
    // Статические пути
    static: ROUTES,

    // Динамические пути с параметрами
    dynamic: {
      todoDetail: (id: string) => ROUTES.TODO_DETAIL(id),
      todoEdit: (id: string) => ROUTES.TODO_EDIT(id),
      workspaceDashboard: (id: string) => ROUTES.WORKSPACE_DASHBOARD(id),
    },

    // Stateful пути
    stateful: {
      workspaceCreate: ROUTES.WORKSPACE_CREATE,
      workspaceSelect: ROUTES.WORKSPACE_SELECT,
    },
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
 * Горячие клавиши для разработки (можно использовать в dev tools)
 */
export const devShortcuts = {
  // Показать отладочную информацию
  debug: () => debugRouting(),

  // Показать все маршруты
  routes: () => console.table(Object.entries(ROUTES).map(([key, path]) => ({ key, path }))),

  // Показать навигацию
  navigation: () =>
    console.table([...Object.values(navigationConfig), ...Object.values(statefulNavigationConfig)]),

  // Валидация
  validate: () => validateRouteConfig(),
};
