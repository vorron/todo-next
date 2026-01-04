import { createPublicPathGuard, createProtectedPathGuard, createAuthGuard } from './guards';
import { createDynamicPath } from './utils';
import { routeConfigData, dynamicRouteConfigData, TITLE_POSTFIX } from '../../config/router-config';

import type { NavItem } from './config-types';
import type { Metadata } from 'next';

// === Paths Generator ===
export const paths = Object.fromEntries(
  Object.entries(routeConfigData).map(([key, config]) => [key, config.path]),
) as Record<keyof typeof routeConfigData, string>;

// === Dynamic Paths Generator (автоматически из конфига) ===
export const dynamicPaths = Object.fromEntries(
  Object.entries(dynamicRouteConfigData).map(([key, config]) => [
    key,
    (id: string) => createDynamicPath(config.path, { id }),
  ]),
) as Record<keyof typeof dynamicRouteConfigData, (id: string) => string>;

export const routes = { ...paths, ...dynamicPaths } as const;

// === Navigation Generator ===
export const navigationConfig = Object.fromEntries(
  Object.entries(routeConfigData)
    .filter(([_, config]) => 'navigation' in config && config.navigation)
    .map(([key, config]) => [
      key,
      {
        label: (
          config as typeof config & {
            navigation: { label: string; order: number; hideWhenAuthenticated?: boolean };
          }
        ).navigation.label,
        href: config.path,
        requiresAuth: 'protected' in config && !!config.protected,
        hideWhenAuthenticated: (
          config as typeof config & { navigation: { hideWhenAuthenticated?: boolean } }
        ).navigation?.hideWhenAuthenticated,
        order: (config as typeof config & { navigation: { order: number } }).navigation.order,
      } satisfies NavItem,
    ]),
) as unknown as Record<keyof typeof routeConfigData, NavItem>;

export const mainNavigation = Object.values(navigationConfig).sort((a, b) => a.order - b.order);

// === Metadata Generator ===
export const metadataConfig = Object.fromEntries(
  Object.entries(routeConfigData).map(([, config]) => [
    config.path,
    {
      ...config.metadata,
      title: `${config.metadata.title}${TITLE_POSTFIX}`,
    },
  ]),
) as Record<string, Metadata>;

// === Dynamic Metadata Generator (автоматически из конфига) ===
export const dynamicMetadata = Object.fromEntries(
  Object.entries(dynamicRouteConfigData).map(([key, config]) => [
    key,
    (title: string): Metadata => ({
      ...config.metadata(title),
      title: `${config.metadata(title).title}${TITLE_POSTFIX}`,
    }),
  ]),
) as Record<keyof typeof dynamicRouteConfigData, (title: string) => Metadata>;

// === Header Generator ===
export const headerTemplates = {
  ...Object.fromEntries(
    [...Object.entries(routeConfigData), ...Object.entries(dynamicRouteConfigData)]
      .filter(([_, config]) => config.header)
      .map(([key, config]) => [key, config.header]),
  ),
} as const;

// === Guards Generator ===
export const publicPaths = new Set(
  Object.entries(routeConfigData)
    .filter(([_, config]) => 'public' in config && config.public)
    .map(([_, config]) => config.path),
);

export const protectedPaths = new Set(
  Object.entries(routeConfigData)
    .filter(([_, config]) => 'protected' in config && config.protected)
    .map(([_, config]) => config.path),
);

// === Protected Patterns Generator (автоматически из конфига) ===
export const protectedPatterns = [
  ...Object.values(dynamicRouteConfigData).map(
    (config) => new RegExp(`^${config.path.replace(/:[^/]+/g, '[^/]+')}$`),
  ),
] as const;

export const protectedPatternsArray = [...protectedPatterns] as RegExp[];

// Create guard functions
export const isPublicPath = createPublicPathGuard(publicPaths);
export const isProtectedPath = createProtectedPathGuard(protectedPaths, protectedPatternsArray);
export const requiresAuth = createAuthGuard(protectedPaths, protectedPatternsArray);

// === Types ===
export type { RouteKey, DynamicRouteKey, AllRouteKey } from './config-types';

// Переопределяем типы с реальными данными для строгой типизации
type RouteConfigData = typeof routeConfigData;
type DynamicRouteConfigData = typeof dynamicRouteConfigData;

export type StrictRouteKey = keyof RouteConfigData;
export type StrictDynamicRouteKey = keyof DynamicRouteConfigData;
export type StrictAllRouteKey = StrictRouteKey | StrictDynamicRouteKey;

// === Generated Utility Types ===
export type HeaderTemplateKey = keyof typeof headerTemplates;
export type MetadataKey = keyof typeof metadataConfig;
export type NavConfigKey = keyof typeof navigationConfig;
