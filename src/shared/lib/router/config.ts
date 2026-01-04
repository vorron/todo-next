/**
 * Router API - Единая точка входа для всей функциональности роутера
 *
 * Импортирует конфигурацию маршрутов из shared/config/router-config.ts
 * и экспортирует готовые утилиты, типы и функции для работы с маршрутизацией
 *
 * Основной экспорт для использования в приложении:
 * - routeConfig, dynamicRouteConfig - конфигурация маршрутов
 * - paths, routes, dynamicPaths - сгенерированные пути и утилиты
 * - isPublicPath, isProtectedPath - guards для проверки доступа
 * - validateRouteConfig - валидация конфигурации
 */

// === Import raw data ===
export {
  routeConfigData as routeConfig,
  dynamicRouteConfigData as dynamicRouteConfig,
} from '../../config/router-config';

// === Import generated utilities ===
export {
  paths,
  routes,
  dynamicPaths,
  dynamicMetadata,
  protectedPatterns,
  protectedPatternsArray,
  navigationConfig,
  mainNavigation,
  metadataConfig,
  headerTemplates,
  publicPaths,
  protectedPaths,
  isPublicPath,
  isProtectedPath,
  requiresAuth,
} from './generators';

// === Import validation ===
export { validateRouteConfig, validateConfigInDev } from './validation';

// === Import types ===
export type {
  RouteKey,
  DynamicRouteKey,
  AllRouteKey,
  AppStaticPath,
  AppDynamicPath,
  AppRoutePath,
} from './config-types';

export type { HeaderTemplateKey, MetadataKey, NavConfigKey } from './generators';
export type { StrictRouteKey, StrictDynamicRouteKey, StrictAllRouteKey } from './generators';
