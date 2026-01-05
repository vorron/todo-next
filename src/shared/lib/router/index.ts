/**
 * Router API - Единая точка доступа к роутингу приложения
 * Простой, прозрачный и типизированный интерфейс
 */

// Runtime валидация в development

// === Imports for local use ===
import { metadataConfig } from './generators';
import { createBreadcrumbs } from './utils';
import { validateConfigInDev } from './validation';
import { type ROUTES } from '../../config/router-config';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { statefulRouteConfigData } from '../../config/router-config';

validateConfigInDev();

// === Generated Data ===
export {
  routeConfigData as routeConfig,
  dynamicRouteConfigData as dynamicRouteConfig,
  statefulRouteConfigData,
  ROUTES,
} from '../../config/router-config';

export { dynamicMetadata } from './generators';

export {
  paths,
  routes,
  dynamicPaths,
  statefulRoutes,
  navigationConfig,
  statefulNavigationConfig,
  mainNavigation,
  metadataConfig,
  statefulMetadataConfig,
  headerTemplates,
  statefulHeaderTemplates,
  protectedPatterns,
  protectedPatternsArray,
  isPublicPath,
  isProtectedPath,
  requiresAuth,
} from './generators';

// === Utilities ===
export {
  createDynamicPath,
  extractPathParams,
  isPathMatch,
  createBreadcrumbs,
  filterNavigationByAuth,
} from './utils';

// === Config Constants ===
export { TITLE_POSTFIX } from '../../config/router-config';

// === Validation ===
export { validateRouteConfig, validateConfigInDev } from './validation';

// === Guards ===
export {
  requiresAuthentication,
  createPublicPathGuard,
  createProtectedPathGuard,
  createAuthGuard,
} from './guards';

// === Types ===
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
  StatefulRouteConfig,
} from './config-types';

export type {
  RouteKey,
  DynamicRouteKey,
  AllRouteKey,
  AppStaticPath,
  AppDynamicPath,
  AppRoutePath,
} from './config-types';

export type { headerTemplateKeys, metadataKeys, navConfigKeys, routeKeys } from './generators';

export type AppRoute = keyof typeof ROUTES;

// === Convenience Functions ===
export function getRouteMetadata(path: string) {
  return metadataConfig[path as keyof typeof metadataConfig] ?? {};
}

export const getStaticMetadata = getRouteMetadata;
export const getBreadcrumbs = createBreadcrumbs;
