import type { Metadata } from 'next';

/**
 * Общие типы для маршрутизации - переиспользуемые между проектами
 */

export type StaticPath = string;
export type DynamicPath = string;
export type RoutePath = StaticPath | DynamicPath;

export type RouteParams = Record<string, string | number>;

export type NavItem<T extends RoutePath = RoutePath> = {
  readonly label: string;
  readonly href: T;
  readonly icon?: string;
  readonly requiresAuth?: boolean;
  readonly hideWhenAuthenticated?: boolean;
  readonly order?: number;
};

export type Breadcrumb = {
  readonly href: string;
  readonly label: string;
};

export type HeaderDescriptor = {
  readonly title: string;
  readonly breadcrumbs: ReadonlyArray<{ href: string; label: string }>;
};

export type HeaderTemplate<T = unknown> = {
  readonly type: 'static' | 'entity';
  readonly descriptor?: HeaderDescriptor;
  readonly fallback?: HeaderDescriptor;

  readonly build?: (data: T) => HeaderDescriptor;
};

export type RouteGuard = {
  readonly test: (path: string) => boolean;
  readonly action: 'allow' | 'deny' | 'redirect';
  readonly target?: string;
};

/**
 * Base types for route configuration
 */
type BaseRouteConfig = {
  path: string;
  metadata: Metadata;
  navigation?: {
    label: string;
    order?: number;
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
  readonly path: string;
  readonly protected: boolean;
  readonly metadata: (title: string) => Metadata;
  readonly header: {
    readonly type: 'entity';
    readonly fallback: {
      readonly title: string;
      readonly breadcrumbs: ReadonlyArray<{ href: string; label: string }>;
    };
    readonly build: (data: { id: string; text: string }) => HeaderDescriptor;
  };
};

/**
 * Stateful Route Configuration - для маршрутов с несколькими состояниями
 * Поддерживает client-side навигацию внутри одного URL
 */
export type StatefulRouteConfig<T extends Record<string, unknown> = Record<string, unknown>> =
  BaseRouteConfig & {
    protected: true;
    states: Record<
      string,
      {
        key: string;
        component?: string; // путь к компоненту
        metadata?: (data?: unknown) => Metadata;
        header?: HeaderTemplate;
        navigation?: {
          label: string;
          order?: number;
          hideWhenAuthenticated?: boolean;
        };
        urlPattern?: string; // опциональный паттерн для URL синхронизации
      }
    >;
    defaultState: keyof T;
    syncWithUrl?: boolean; // синхронизировать состояния с URL
    fallbackState?: keyof T; // состояние для fallback
  };

/**
 * Generated types from configuration data
 * Эти типы будут переопределены в generators.ts после импорта данных
 */
export type RouteKey = string;
export type DynamicRouteKey = string;
export type StatefulRouteKey = string;
export type AllRouteKey = RouteKey | DynamicRouteKey | StatefulRouteKey;

/**
 * Stateful routing types
 */
export type RouteState<T = unknown> = {
  key: string;
  data?: T;
  metadata?: Metadata;
  header?: HeaderDescriptor;
};

export type StatefulNavigation<T = unknown> = {
  currentState: string;
  availableStates: string[];
  navigateTo: (state: string, data?: T) => void;
  syncWithUrl?: boolean;
};

/**
 * App types for convenience
 */
export type AppStaticPath = string;
export type AppDynamicPath = string;
export type AppRoutePath = AppStaticPath | AppDynamicPath;
