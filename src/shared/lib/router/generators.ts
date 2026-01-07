import { createDynamicPath } from './utils';
import {
  routeConfigData,
  dynamicRouteConfigData,
  statefulRouteConfigData,
  TITLE_POSTFIX,
} from '../../config/router-config';

import type {
  NavigationConfig,
  RouteConfig,
  DynamicRouteConfig,
  StatefulRouteConfig,
} from './config-types';
import type { Metadata } from 'next';

// === Type Guards для безопасной типизации ===
function hasNavigation(config: unknown): config is {
  navigation: NavigationConfig;
} {
  return typeof config === 'object' && config !== null && 'navigation' in config;
}

function hasMetadata(config: unknown): config is {
  metadata: (data?: unknown) => Metadata;
} {
  return (
    typeof config === 'object' &&
    config !== null &&
    'metadata' in config &&
    typeof (config as { metadata?: unknown }).metadata === 'function'
  );
}

function hasUrlPattern(config: unknown): config is {
  urlPattern: string;
} {
  return (
    typeof config === 'object' &&
    config !== null &&
    'urlPattern' in config &&
    typeof (config as { urlPattern?: unknown }).urlPattern === 'string'
  );
}

function isProtectedRoute(
  config: RouteConfig | DynamicRouteConfig | StatefulRouteConfig,
): config is (RouteConfig & { protected: true }) | DynamicRouteConfig | StatefulRouteConfig {
  return 'protected' in config && config.protected === true;
}

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

// === Stateful Routes ===
export const statefulRoutes = Object.fromEntries(
  Object.entries(statefulRouteConfigData).map(([key, config]) => [
    key,
    {
      basePath: config.path,
      defaultState: config.defaultState,
      syncWithUrl: config.syncWithUrl,
      getStatePath: (state: string, data?: Record<string, string>) => {
        const stateConfig = config.states[state as keyof typeof config.states];
        const pattern = (stateConfig as { urlPattern?: string }).urlPattern || config.path;

        if (data && pattern.includes(':')) {
          return pattern.replace(
            /:([^/]+)/g,
            (_match: string, param: string) => data[param] || `:${param}`,
          );
        }

        return pattern;
      },
      getAvailableStates: () => Object.keys(config.states),
      isStateAvailable: (state: string) => state in config.states,
    },
  ]),
);

// === Combined Routes ===
export const routes = { ...paths, ...dynamicPaths, ...statefulRoutes } as const;

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

export const statefulNavigationConfig = Object.fromEntries(
  Object.entries(statefulRouteConfigData).map(([key, config]) => [
    key,
    {
      label: hasNavigation(config)
        ? (config as StatefulRouteConfig & { navigation: NavigationConfig }).navigation.label
        : key,
      href: config.path,
      requiresAuth: isProtectedRoute(config),
      order: hasNavigation(config)
        ? (config as StatefulRouteConfig & { navigation: NavigationConfig }).navigation.order
        : undefined,
      hideWhenAuthenticated: hasNavigation(config)
        ? (config as StatefulRouteConfig & { navigation: NavigationConfig }).navigation
            .hideWhenAuthenticated
        : undefined,
      hideFromMainMenu: hasNavigation(config)
        ? (config as StatefulRouteConfig & { navigation: NavigationConfig }).navigation
            .hideFromMainMenu
        : undefined,
      level: hasNavigation(config)
        ? (config as StatefulRouteConfig & { navigation: NavigationConfig }).navigation.level
        : undefined,
      parent: hasNavigation(config)
        ? (config as StatefulRouteConfig & { navigation: NavigationConfig }).navigation.parent
        : undefined,
      icon: hasNavigation(config)
        ? (config as StatefulRouteConfig & { navigation: NavigationConfig }).navigation.icon
        : undefined,
      isStateful: true,
      states: Object.fromEntries(
        Object.entries(config.states).map(([stateKey, stateConfig]) => {
          const navConfig = hasNavigation(stateConfig)
            ? (stateConfig as { navigation: NavigationConfig }).navigation
            : undefined;
          return [
            stateKey,
            {
              label: navConfig?.label ?? stateKey,
              href: hasUrlPattern(stateConfig)
                ? (stateConfig as { urlPattern: string }).urlPattern
                : config.path,
              order: navConfig?.order,
              level: navConfig?.level,
              parent: navConfig?.parent,
            },
          ];
        }),
      ),
    } satisfies StatefulNavigationItem,
  ]),
) as Record<keyof typeof statefulRouteConfigData, StatefulNavigationItem>;

// === Main Navigation ===
export const mainNavigation = [
  ...Object.values(navigationConfig)
    .filter((item) => !item.hideWhenAuthenticated)
    .filter((item) => !item.hideFromMainMenu)
    .filter((item) => item.level !== 'page'), // Только разделы в главном меню
  ...Object.values(statefulNavigationConfig)
    .filter((item) => !item.hideWhenAuthenticated)
    .filter((item) => !item.hideFromMainMenu)
    .filter((item) => item.level !== 'page') // Только разделы в главном меню
    .filter(
      (statefulItem) =>
        !Object.values(navigationConfig).some(
          (staticItem) => staticItem.href === statefulItem.href,
        ),
    )
    .map(({ states: _states, ...item }) => item),
].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

// === Section Navigation (включая страницы) ===
export const sectionNavigation = [
  ...Object.values(navigationConfig)
    .filter((item) => !item.hideWhenAuthenticated)
    .filter((item) => !item.hideFromMainMenu),
  ...Object.values(statefulNavigationConfig)
    .filter((item) => !item.hideWhenAuthenticated)
    .filter((item) => !item.hideFromMainMenu)
    .filter(
      (statefulItem) =>
        !Object.values(navigationConfig).some(
          (staticItem) => staticItem.href === statefulItem.href,
        ),
    )
    .map(({ states: _states, ...item }) => item),
].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

// === Metadata ===
type StatefulMetadataItem = {
  base: { title: string };
  states: Record<string, (data?: unknown) => Metadata>;
};

export const statefulMetadataConfig = Object.fromEntries(
  Object.entries(statefulRouteConfigData).map(([key, config]) => [
    key,
    {
      base: {
        ...config.metadata,
        title: `${config.metadata.title}${TITLE_POSTFIX}`,
      },
      states: Object.fromEntries(
        Object.entries(config.states).map(([stateKey, stateConfig]) => {
          if (hasMetadata(stateConfig)) {
            return [
              stateKey,
              (data?: unknown) => {
                const metadata = stateConfig.metadata(data);
                return {
                  ...metadata,
                  title: `${metadata.title}${TITLE_POSTFIX}`,
                };
              },
            ];
          }
          return [
            stateKey,
            () => ({
              ...config.metadata,
              title: `${config.metadata.title}${TITLE_POSTFIX}`,
            }),
          ];
        }),
      ),
    } satisfies StatefulMetadataItem,
  ]),
) as unknown as Record<keyof typeof statefulRouteConfigData, StatefulMetadataItem>;

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
  ...Object.fromEntries(
    Object.entries(statefulRouteConfigData).map(([, config]) => [
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
  ...Object.values(statefulRouteConfigData).map((config) => config.path),
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
export type { RouteKey, DynamicRouteKey, AllRouteKey, StatefulRouteKey } from './config-types';

// Переопределяем типы с реальными данными для строгой типизации
type RouteConfigData = typeof routeConfigData;
type DynamicRouteConfigData = typeof dynamicRouteConfigData;
type StatefulRouteConfigData = typeof statefulRouteConfigData;

export type StrictRouteKey = keyof RouteConfigData;
export type StrictDynamicRouteKey = keyof DynamicRouteConfigData;
export type StrictStatefulRouteKey = keyof StatefulRouteConfigData;

export type StrictAppRoutePath = RouteConfigData[StrictRouteKey]['path'];
export type StrictAppDynamicPath = DynamicRouteConfigData[StrictDynamicRouteKey]['path'];
export type StrictAppStatefulPath = StatefulRouteConfigData[StrictStatefulRouteKey]['path'];

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
  | RouteConfigData[keyof typeof routeConfigData]['header']
  | DynamicRouteConfigData[keyof typeof dynamicRouteConfigData]['header']
>;

export const statefulHeaderTemplates = Object.fromEntries(
  Object.entries(statefulRouteConfigData).map(([key, config]) => [key, config.header]),
) as Record<
  keyof typeof statefulRouteConfigData,
  StatefulRouteConfigData[keyof typeof statefulRouteConfigData]['header']
>;

export const headerTemplateKeys = {
  ...(Object.keys(headerTemplates) as Array<keyof typeof headerTemplates>),
  ...(Object.keys(statefulHeaderTemplates) as Array<keyof typeof statefulHeaderTemplates>),
} as const;

// === Metadata Keys ===
export const metadataKeys = {
  ...(Object.keys(metadataConfig) as (keyof typeof metadataConfig)[]),
  ...(Object.keys(statefulMetadataConfig) as (keyof typeof statefulMetadataConfig)[]),
} as const;

// === Navigation Keys ===
export const navConfigKeys = {
  ...(Object.keys(navigationConfig) as (keyof typeof navigationConfig)[]),
  ...(Object.keys(statefulNavigationConfig) as (keyof typeof statefulNavigationConfig)[]),
} as const;

// === Route Keys ===
export const routeKeys = {
  ...(Object.keys(routeConfigData) as (keyof typeof routeConfigData)[]),
  ...(Object.keys(dynamicRouteConfigData) as (keyof typeof dynamicRouteConfigData)[]),
  ...(Object.keys(statefulRouteConfigData) as (keyof typeof statefulRouteConfigData)[]),
} as const;
