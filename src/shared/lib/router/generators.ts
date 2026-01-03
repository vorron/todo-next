import { routeConfig, dynamicRouteConfig, dynamicPaths, protectedPatterns } from './config';
import { createPublicPathGuard, createProtectedPathGuard, createAuthGuard } from './guards';

import type { NavItem } from './types';
import type { Metadata } from 'next';

// === Paths Generator ===
export const paths = Object.fromEntries(
  Object.entries(routeConfig).map(([key, config]) => [key, config.path]),
) as Record<keyof typeof routeConfig, string>;

export const routes = { ...paths, ...dynamicPaths } as const;

// === Navigation Generator ===
export const navigationConfig = Object.fromEntries(
  Object.entries(routeConfig)
    .filter(([_, config]) => 'navigation' in config && config.navigation)
    .map(([key, config]) => [
      key,
      {
        label: (config as typeof config & { navigation: { label: string; order: number } })
          .navigation.label,
        href: config.path,
        requiresAuth: 'protected' in config && !!config.protected,
      } satisfies NavItem,
    ]),
) as Record<keyof typeof routeConfig, NavItem>;

export const mainNavigation = Object.values(navigationConfig).sort((a, b) => {
  const routeA = routeConfig[a.href as keyof typeof routeConfig];
  const routeB = routeConfig[b.href as keyof typeof routeConfig];

  if (!routeA || !routeB) return 0;

  const orderA = ('navigation' in routeA && routeA.navigation?.order) ?? 999;
  const orderB = ('navigation' in routeB && routeB.navigation?.order) ?? 999;

  return (orderA as number) - (orderB as number);
});

// === Metadata Generator ===
export const metadataConfig = Object.fromEntries(
  Object.entries(routeConfig).map(([, config]) => [config.path, config.metadata]),
) as Record<string, Metadata>;

// === Header Generator ===
export const headerTemplates = {
  ...Object.fromEntries(
    Object.entries(routeConfig)
      .filter(([_, config]) => config.header)
      .map(([key, config]) => [key, config.header]),
  ),
  ...Object.fromEntries(
    Object.entries(dynamicRouteConfig)
      .filter(([_, config]) => config.header)
      .map(([key, config]) => [key, config.header]),
  ),
} as const;

// === Guards Generator ===
export const publicPaths = new Set(
  Object.entries(routeConfig)
    .filter(([_, config]) => 'public' in config && config.public)
    .map(([_, config]) => config.path),
);

export const protectedPaths = new Set(
  Object.entries(routeConfig)
    .filter(([_, config]) => 'protected' in config && config.protected)
    .map(([_, config]) => config.path),
);

export const protectedPatternsArray = [...protectedPatterns] as RegExp[];

// Create guard functions
export const isPublicPath = createPublicPathGuard(publicPaths);
export const isProtectedPath = createProtectedPathGuard(protectedPaths, protectedPatternsArray);
export const requiresAuth = createAuthGuard(protectedPaths, protectedPatternsArray);

// === Types ===
export type { RouteKey, DynamicRouteKey, AllRouteKey } from './config';

// === Generated Utility Types ===
export type HeaderTemplateKey = keyof typeof headerTemplates;
export type MetadataKey = keyof typeof metadataConfig;
export type NavConfigKey = keyof typeof navigationConfig;
