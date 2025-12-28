import { dynamicPaths, paths } from './paths';

export const ROUTES = {
  // Public routes
  HOME: paths.home,
  LOGIN: paths.login,
  ABOUT: paths.about,
  SETTINGS: paths.settings,

  // Protected routes
  TODOS: paths.todos,
  PROFILE: paths.profile,

  // Dynamic routes
  TODO_DETAIL: dynamicPaths.todoDetail,
  TODO_EDIT: dynamicPaths.todoEdit,
} as const;

export type AppRoute = keyof typeof ROUTES;

export { routes, paths, dynamicPaths } from './paths';
export type { StaticPath, DynamicPath, RoutePath } from './paths';

export { navigationConfig, mainNavigation, filterNavigation, getBreadcrumbs } from './navigation';
export type { NavItem, NavConfigKey, Breadcrumb } from './navigation';

export { metadataConfig, dynamicMetadata, getStaticMetadata } from './metadata';
export type { MetadataKey } from './metadata';

export { publicPaths, protectedPaths, isPublicPath, isProtectedPath, requiresAuth } from './guards';

export { headerTemplates } from './header';
export type { HeaderTemplateKey } from './header';
export type { HeaderTemplate, HeaderDescriptor } from '@/shared/types/header';
