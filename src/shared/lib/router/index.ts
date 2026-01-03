/**
 * Router API - Единая точка доступа к роутингу приложения
 * Простой, прозрачный и типизированный интерфейс
 */

// === Imports for local use ===
import { dynamicPaths } from './config';
import { paths, metadataConfig } from './generators';
import { createBreadcrumbs } from './utils';

// === Generated Data ===
export {
  routeConfig,
  dynamicRouteConfig,
  dynamicPaths,
  dynamicMetadata,
  protectedPatterns,
} from './config';

export {
  paths,
  routes,
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
} from './types';

export type {
  RouteKey,
  DynamicRouteKey,
  AllRouteKey,
  AppStaticPath,
  AppDynamicPath,
  AppRoutePath,
} from './config';

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
export function getStaticMetadata(path: string) {
  return metadataConfig[path as keyof typeof metadataConfig];
}

// Backward compatibility functions
export function getRouteMetadata(path: string) {
  return metadataConfig[path as keyof typeof metadataConfig] ?? {};
}

export const getBreadcrumbs = createBreadcrumbs;
