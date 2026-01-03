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
};

export type Breadcrumb = {
  readonly href: string;
  readonly label: string;
};

export type HeaderDescriptor = {
  readonly title: string;
  readonly breadcrumbs: Breadcrumb[];
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

export type RouteConfig<T extends RoutePath = RoutePath> = {
  readonly path: T;
  readonly metadata?: Record<string, unknown>;
  readonly guards?: RouteGuard[];
  readonly header?: HeaderTemplate;
};
