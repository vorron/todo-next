/**
 * Router API - Единая точка доступа к роутингу приложения
 * Простой, прозрачный и типизированный интерфейс
 */

// Runtime валидация в development

// === Imports for local use ===
import { paths, metadataConfig, dynamicPaths } from './generators';
import { createBreadcrumbs } from './utils';
import { validateConfigInDev } from './validation';

validateConfigInDev();

// === Generated Data ===
export {
  routeConfigData as routeConfig,
  dynamicRouteConfigData as dynamicRouteConfig,
} from '../../config/router-config';

export { dynamicMetadata, protectedPatterns } from './generators';

export {
  paths,
  routes,
  dynamicPaths,
  navigationConfig,
  mainNavigation,
  metadataConfig,
  headerTemplates,
  publicPaths,
  protectedPaths,
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
} from './config-types';

export type {
  RouteKey,
  DynamicRouteKey,
  AllRouteKey,
  AppStaticPath,
  AppDynamicPath,
  AppRoutePath,
} from './config-types';

export type { HeaderTemplateKey, MetadataKey, NavConfigKey } from './generators';

export const ROUTES = {
  HOME: paths.home,
  LOGIN: paths.login,
  ABOUT: paths.about,
  TODOS: paths.todos,
  PROFILE: paths.profile,
  SETTINGS: paths.settings,
  TODO_DETAIL: dynamicPaths.todoDetail,
  TODO_EDIT: dynamicPaths.todoEdit,
} as const;

export type AppRoute = keyof typeof ROUTES;

// === Convenience Functions ===
export function getRouteMetadata(path: string) {
  return metadataConfig[path as keyof typeof metadataConfig] ?? {};
}

export const getStaticMetadata = getRouteMetadata;
export const getBreadcrumbs = createBreadcrumbs;
