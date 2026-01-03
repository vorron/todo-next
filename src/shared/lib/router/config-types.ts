import type { HeaderTemplate } from './types';
import type { Metadata } from 'next';

/**
 * Base types for route configuration
 */
type BaseRouteConfig = {
  path: string;
  metadata: Metadata;
  navigation?: {
    label: string;
    order: number;
    hideWhenAuthenticated?: boolean;
  };
  header?: HeaderTemplate;
  layout?: 'default' | 'auth' | 'dashboard';
};

type PublicRouteConfig = BaseRouteConfig & { public: true; protected?: never };
type ProtectedRouteConfig = BaseRouteConfig & { protected: true; public?: never };

export type RouteConfig = PublicRouteConfig | ProtectedRouteConfig;

/**
 * Dynamic route configuration types
 */
export type DynamicRouteConfig = {
  path: string;
  protected: boolean;
  metadata: (title: string) => Metadata;
  header: {
    type: 'entity';
    fallback: {
      title: string;
      breadcrumbs: Array<{ href: string; label: string }>;
    };
    build: (data: { id: string; text: string }) => {
      title: string;
      breadcrumbs: Array<{ href: string; label: string }>;
    };
  };
};

/**
 * Generated types from configuration data
 * Эти типы будут переопределены в generators.ts после импорта данных
 */
export type RouteKey = string;
export type DynamicRouteKey = string;
export type AllRouteKey = RouteKey | DynamicRouteKey;

/**
 * App types for convenience
 */
export type AppStaticPath = string;
export type AppDynamicPath = string;
export type AppRoutePath = AppStaticPath | AppDynamicPath;
