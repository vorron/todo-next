import {
  BASE_PATHS,
  DYNAMIC_PATH_TEMPLATES,
  routeConfigData,
  dynamicRouteConfigData,
  TITLE_POSTFIX,
} from '@/shared/config/router-config';

import { mainNavigationFilter, sectionNavigationFilter } from './navigation-filters';
import { hasNavigation, isProtectedRoute } from './type-guards';
import { createDynamicPath } from './utils';

import type { NavigationConfig, RouteConfig } from './config-types';
import type { Metadata } from 'next';

// === Type Guards импортированы из type-guards.ts ===

// === Generated ROUTES Object ===

/**
 * Сгенерированный объект ROUTES - основной API для работы с маршрутами
 * Автоматически создается из конфигурации без циклических зависимостей
 */
export const ROUTES = {
  // Статические маршруты из BASE_PATHS (исключая TRACKER - он только stateful)
  HOME: BASE_PATHS.HOME,
  LOGIN: BASE_PATHS.LOGIN,
  ABOUT: BASE_PATHS.ABOUT,
  TODOS: BASE_PATHS.TODOS,
  TRACKER_SELECT: BASE_PATHS.TRACKER_SELECT,
  TRACKER_MANAGE: BASE_PATHS.TRACKER_MANAGE,
  PROFILE: BASE_PATHS.PROFILE,
  SETTINGS: BASE_PATHS.SETTINGS,

  // Алиасы для обратной совместимости
  WORKSPACE: BASE_PATHS.TRACKER,
  TRACKER: BASE_PATHS.TRACKER, // Для обратной совместимости
  WORKSPACE_SELECT: BASE_PATHS.TRACKER_SELECT,
  WORKSPACE_MANAGE: BASE_PATHS.TRACKER_MANAGE,

  // Динамические маршруты со строгой типизацией
  TODO_DETAIL: (id: string) =>
    DYNAMIC_PATH_TEMPLATES.TODO_DETAIL.replace(':id', id) as `/todos/${string}`,
  TODO_EDIT: (id: string) =>
    DYNAMIC_PATH_TEMPLATES.TODO_EDIT.replace(':id', id) as `/todos/${string}/edit`,
  WORKSPACE_DASHBOARD: (id: string) =>
    DYNAMIC_PATH_TEMPLATES.TRACKER_DASHBOARD.replace(':id', id) as `/tracker/${string}`,
  WORKSPACE_TIME_ENTRY: (id: string) =>
    DYNAMIC_PATH_TEMPLATES.TRACKER_TIME_ENTRY.replace(':id', id) as `/tracker/${string}/time-entry`,
  WORKSPACE_REPORTS: (id: string) =>
    DYNAMIC_PATH_TEMPLATES.TRACKER_REPORTS.replace(':id', id) as `/tracker/${string}/reports`,
  WORKSPACE_PROJECTS: (id: string) =>
    DYNAMIC_PATH_TEMPLATES.TRACKER_PROJECTS.replace(':id', id) as `/tracker/${string}/projects`,
} as const;

/**
 * Типы для сгенерированного ROUTES
 */
export type RoutesType = typeof ROUTES;

// === Static Paths ===
export const paths = Object.fromEntries(
  Object.entries(routeConfigData).map(([key, config]) => [key, config.path]),
) as Record<keyof typeof routeConfigData, string>;

// === Dynamic Paths ===
export const dynamicPaths = Object.fromEntries(
  Object.entries(dynamicRouteConfigData).map(([key, config]) => [
    key,
    (id: string) => createDynamicPath(config.path, { id }),
  ]),
) as Record<keyof typeof dynamicRouteConfigData, (id: string) => string>;

// === Combined Routes ===
export const routes = { ...paths, ...dynamicPaths } as const;

// === Navigation ===
export type NavigationItem = {
  label: string;
  href: string;
  requiresAuth: boolean;
  hideWhenAuthenticated?: boolean;
  hideFromMainMenu?: boolean;
  level?: 'section' | 'page';
  parent?: string;
  order?: number;
  icon?: string;
};

export const navigationConfig = Object.fromEntries(
  Object.entries(routeConfigData)
    .filter(([_, config]) => hasNavigation(config))
    .map(([key, config]) => [
      key,
      {
        label: (config as RouteConfig & { navigation: NavigationConfig }).navigation.label,
        href: config.path,
        requiresAuth: isProtectedRoute(config),
        hideWhenAuthenticated: (config as RouteConfig & { navigation: NavigationConfig }).navigation
          ?.hideWhenAuthenticated,
        hideFromMainMenu: (config as RouteConfig & { navigation: NavigationConfig }).navigation
          ?.hideFromMainMenu,
        level: (config as RouteConfig & { navigation: NavigationConfig }).navigation?.level,
        parent: (config as RouteConfig & { navigation: NavigationConfig }).navigation?.parent,
        order: (config as RouteConfig & { navigation: NavigationConfig }).navigation?.order,
        icon: (config as RouteConfig & { navigation: NavigationConfig }).navigation?.icon,
      } as NavigationItem,
    ]),
) as Record<keyof typeof routeConfigData, NavigationItem>;

// === Stateful Navigation ===
export type StatefulNavigationItem = NavigationItem & {
  isStateful: true;
  states: Record<
    string,
    {
      label: string;
      href: string;
      order?: number;
      level?: 'section' | 'page';
      parent?: string;
    }
  >;
};

// === Main Navigation ===
export const mainNavigation = [...mainNavigationFilter(Object.values(navigationConfig))].sort(
  (a, b) => (a.order ?? 999) - (b.order ?? 999),
);

// === Section Navigation (включая страницы) ===
export const sectionNavigation = [...sectionNavigationFilter(Object.values(navigationConfig))].sort(
  (a, b) => (a.order ?? 999) - (b.order ?? 999),
);

// === Metadata ===
export const metadataConfig = {
  ...Object.fromEntries(
    Object.entries(routeConfigData).map(([, config]) => [
      config.path,
      {
        ...config.metadata,
        title: `${config.metadata.title}${TITLE_POSTFIX}`,
      },
    ]),
  ),
} as Record<string, Metadata>;

// === Dynamic Metadata ===
export const dynamicMetadata = Object.fromEntries(
  Object.entries(dynamicRouteConfigData).map(([key, config]) => [
    key,
    (title: string): Metadata => ({
      ...config.metadata(title),
      title: `${config.metadata(title).title}${TITLE_POSTFIX}`,
    }),
  ]),
) as Record<keyof typeof dynamicRouteConfigData, (title: string) => Metadata>;

// === Protected Patterns ===
// Включаем статические защищенные маршруты
const staticProtectedPaths = Object.entries(routeConfigData)
  .filter(([_, config]) => isProtectedRoute(config))
  .map(([_, config]) => config.path);

export const protectedPatterns = [
  ...staticProtectedPaths,
  ...Object.values(dynamicRouteConfigData).map((config) => config.path),
];

export const protectedPatternsArray = protectedPatterns.map(
  (pattern) => new RegExp(`^${pattern.replace(/:[^/]+/g, '([^/]+)')}$`),
);

// === Path Sets для удобного использования ===
export const publicPaths = new Set(
  Object.entries(routeConfigData)
    .filter(([_, config]) => !isProtectedRoute(config))
    .map(([_, config]) => config.path),
);

export const protectedPaths = new Set(
  Object.entries(routeConfigData)
    .filter(([_, config]) => isProtectedRoute(config))
    .map(([_, config]) => config.path),
);

// === Guards ===
export const isPublicPath = (path: string): boolean =>
  !protectedPatterns.some((pattern) => path.startsWith(pattern));

export const isProtectedPath = (path: string): boolean =>
  protectedPatterns.some((pattern) => path.startsWith(pattern));

export const requiresAuth = (path: string): boolean => isProtectedPath(path);

// === Types ===
export type { RouteKey, DynamicRouteKey, AllRouteKey } from './config-types';

// === Header Templates ===
export const headerTemplates = {
  ...Object.fromEntries(
    Object.entries(routeConfigData).map(([key, config]) => [key, config.header]),
  ),
  ...Object.fromEntries(
    Object.entries(dynamicRouteConfigData).map(([key, config]) => [key, config.header]),
  ),
} as Record<
  keyof typeof routeConfigData | keyof typeof dynamicRouteConfigData,
  | (typeof routeConfigData)[keyof typeof routeConfigData]['header']
  | (typeof dynamicRouteConfigData)[keyof typeof dynamicRouteConfigData]['header']
>;
