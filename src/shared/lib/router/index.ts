/**
 * Router API - Единая точка доступа к роутингу приложения
 * Простой, прозрачный и типизированный интерфейс
 *
 * @example
 * ```typescript
 * import { ROUTES, paths, navigation } from '@/shared/lib/router';
 *
 * // Использование маршрутов
 * const todoPath = ROUTES.TODO_DETAIL('123');
 * const homePath = paths.HOME;
 *
 * // Использование навигации
 * const mainNav = navigation.mainNavigation;
 * ```
 */

// Runtime валидация в development
import { metadataConfig } from './generators';
import { createBreadcrumbs } from './utils';
import { validateConfigInDev } from './validation';

import type { ROUTES } from './generators';

validateConfigInDev();

// === Core Routing API ===
/**
 * Сгенерированные маршруты приложения с строгой типизацией
 * @example
 * ```typescript
 * ROUTES.HOME // '/'
 * ROUTES.TODO_DETAIL('123') // '/todos/123'
 * ```
 */
export { ROUTES } from './generators';

/**
 * Динамические метаданные для маршрутов с параметрами
 * @example
 * ```typescript
 * const meta = dynamicMetadata.TODO_DETAIL('My Todo');
 * ```
 */
export { dynamicMetadata } from './generators';

/**
 * Исходные конфигурации маршрутов
 */
export {
  routeConfigData as routeConfig,
  dynamicRouteConfigData as dynamicRouteConfig,
} from '../../config/router-config';

/**
 * Постфикс для заголовков страниц
 */
export { TITLE_POSTFIX } from '../../config/router-config';

// === Generated Data ===
/**
 * Сгенерированные пути и связанные данные
 * @example
 * ```typescript
 * paths.paths.HOME // '/'
 * paths.paths.TODOS // '/todos'
 * ```
 */
export * as paths from './generators';

/**
 * Навигационные конфигурации и элементы
 * @example
 * ```typescript
 * navigation.navigation.mainNavigation // Основное меню
 * navigation.navigation.sectionNavigation // Разделы
 * ```
 */
export * as navigation from './generators';

/**
 * Метаданные для всех маршрутов
 * @example
 * ```typescript
 * metadata.metadata.metadataConfig['/'] // { title: 'Home | App' }
 * ```
 */
export * as metadata from './generators';

/**
 * Guard-функции для проверки доступа к маршрутам
 * @example
 * ```typescript
 * guards.guards.isProtectedPath('/todos') // true
 * guards.guards.isPublicPath('/login') // true
 * ```
 */
export * as guards from './generators';

// === Legacy exports for backward compatibility ===
export {
  routes,
  dynamicPaths,
  navigationConfig,
  mainNavigation,
  metadataConfig,
  headerTemplates,
  publicPaths,
  protectedPaths,
  protectedPatterns,
  protectedPatternsArray,
  isPublicPath,
  isProtectedPath,
  requiresAuth,
} from './generators';

// === Utilities ===
/**
 * Утилиты для работы с путями и навигацией
 */
export {
  createDynamicPath,
  extractPathParams,
  isPathMatch,
  createBreadcrumbs,
  filterNavigationByAuth,
} from './utils';

// === Validation ===
/**
 * Валидация конфигурации маршрутов
 * @example
 * ```typescript
 * validateRouteConfig() // { isValid: boolean, errors: string[] }
 * ```
 */
export { validateRouteConfig, validateConfigInDev } from './validation';

// === Development Utils ===
/**
 * Утилиты для отладки роутинга (только в development)
 */
export {
  getRouteInfo,
  findRouteByPath,
  getProtectedRoutes,
  getPublicRoutes,
  debugRouting,
  createPathGenerator,
  createRouteTester,
  devShortcuts,
} from './dev-utils';

// === Route Guards ===
/**
 * Guard-функции для контроля доступа
 * @example
 * ```typescript
 * requiresAuthentication('/todos') // true
 * createAuthGuard() // (path: string) => boolean
 * ```
 */
export {
  requiresAuthentication,
  createPublicPathGuard,
  createProtectedPathGuard,
  createAuthGuard,
} from './guards';

// === Types ===
/**
 * Типы для конфигурации маршрутов
 */
export type {
  StaticPath,
  DynamicPath,
  RoutePath,
  RouteParams,
  NavItem,
  Breadcrumb,
  HeaderDescriptor,
  HeaderTemplate,
  RouteGuard,
  RouteConfig,
  RouteKey,
  DynamicRouteKey,
  AllRouteKey,
  AppStaticPath,
  AppDynamicPath,
  AppRoutePath,
} from './config-types';

/**
 * Тип ключа маршрута из сгенерированного объекта ROUTES
 */
export type AppRoute = keyof typeof ROUTES;

// === Convenience Functions ===
/**
 * Get metadata for a specific route path
 * @param path - Route path to get metadata for
 * @returns Route metadata object or empty object if not found
 */
export function getRouteMetadata(path: string) {
  return metadataConfig[path as keyof typeof metadataConfig] ?? {};
}

export const getStaticMetadata = getRouteMetadata;
export const getBreadcrumbs = createBreadcrumbs;
