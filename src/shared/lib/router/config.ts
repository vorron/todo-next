/**
 * Router Config - Legacy compatibility layer
 * Импортирует данные из data.ts и переэкспортирует их вместе с генераторами
 * Обеспечивает обратную совместимость существующего кода
 */

// === Import raw data ===
export {
  routeConfigData as routeConfig,
  dynamicRouteConfigData as dynamicRouteConfig,
} from './data';

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
