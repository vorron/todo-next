import type { RouteConfig, DynamicRouteConfig, NavigationConfig } from './config-types';
import type { Metadata } from 'next';

/**
 * Builder functions for simplified route configuration
 * Reduces boilerplate and provides smart defaults
 */

// === Server-side Redirect Configuration ===

interface ServerRedirectConfig {
  enabled: boolean;
  strategy: 'static' | 'dynamic';
  target?: string; // For static redirects
  resolver?: string; // Function name for dynamic redirects
  fallback?: string; // Fallback route when no data
}

interface StaticRouteOptions {
  path: string;
  public?: boolean;
  protected?: boolean;
  title: string;
  description: string;
  nav?: NavigationConfig & { order?: number; level?: 'section' | 'page' };
  parent?: string;
  serverRedirect?: ServerRedirectConfig;
}

// Helper для безопасного добавления serverRedirect
function addServerRedirect<T extends Record<string, unknown>>(
  config: T,
  serverRedirect?: ServerRedirectConfig,
): T & { serverRedirect?: ServerRedirectConfig } {
  if (!serverRedirect?.enabled) return config;

  return {
    ...config,
    serverRedirect,
  } as T & { serverRedirect?: ServerRedirectConfig };
}

// === Static Route Builder ===

/**
 * Builder function for static routes with smart defaults
 * Automatically generates metadata and header from title
 */
export function route(options: StaticRouteOptions): RouteConfig {
  const isPublic = options.public === true;

  // Generate breadcrumbs automatically
  const breadcrumbs = [{ href: options.path, label: options.title }];

  const baseConfig = {
    path: options.path,
    metadata: {
      title: options.title,
      description: options.description,
    } satisfies Metadata,
    header: {
      type: 'static' as const,
      descriptor: {
        title: options.title,
        breadcrumbs,
      },
    },
  };

  // Безопасно добавляем serverRedirect
  const configWithRedirect = addServerRedirect(baseConfig, options.serverRedirect);

  if (isPublic) {
    const config: RouteConfig = {
      ...configWithRedirect,
      public: true,
    };

    if (options.nav) {
      config.navigation = options.nav;
    }

    return config;
  } else {
    const config: RouteConfig = {
      ...configWithRedirect,
      protected: true,
    };

    if (options.nav) {
      config.navigation = options.nav;
    }

    return config;
  }
}

// === Dynamic Route Builder ===

interface DynamicRouteOptions<T = unknown> {
  path: string;
  public?: boolean;
  protected?: boolean;
  title: (data: T) => string;
  description?: (data: T) => string;
  parent?: string; // For automatic breadcrumbs
  fallbackTitle?: string;
}

/**
 * Builder function for dynamic routes with smart defaults
 * Automatically generates metadata and header from title function
 */
export function dynamicRoute<T = unknown>(options: DynamicRouteOptions<T>): DynamicRouteConfig {
  const isPublic = options.public === true;
  const isProtected = options.protected === true;

  return {
    path: options.path,
    protected: isProtected || !isPublic,
    metadata: (title: string) => ({
      title: title,
      description: options.description?.({ title } as T) ?? `Details for ${title}`,
    }),
    header: {
      type: 'entity',
      fallback: {
        title: options.fallbackTitle ?? 'Loading...',
        breadcrumbs: [{ href: '#', label: '...' }],
      },
      build: (data: { id: string; text: string }) => {
        const title = options.title(data as T);

        // Generate breadcrumbs with parent support
        const breadcrumbs = options.parent
          ? [
              {
                href: `/${options.parent}`,
                label: options.parent.charAt(0).toUpperCase() + options.parent.slice(1),
              },
              { href: options.path.replace(':id', data.id), label: title },
            ]
          : [{ href: options.path.replace(':id', data.id), label: title }];

        return {
          title,
          breadcrumbs,
        };
      },
    },
  } satisfies DynamicRouteConfig;
}

// === Utility Types ===

export type RouteBuilderOptions = StaticRouteOptions;
export type DynamicRouteBuilderOptions<T = unknown> = DynamicRouteOptions<T>;
