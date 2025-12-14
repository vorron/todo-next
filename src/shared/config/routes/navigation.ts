import { paths } from './paths';
import { capitalize } from '@/shared/lib/utils';

export type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly icon?: string;
  readonly requiresAuth?: boolean;
};

export const navigationConfig = {
  todos: {
    label: 'Todos',
    href: paths.todos,
    requiresAuth: true,
  },
  profile: {
    label: 'Profile',
    href: paths.profile,
    requiresAuth: true,
  },
  about: {
    label: 'About',
    href: paths.about,
  },
  settings: {
    label: 'Settings',
    href: paths.settings,
    requiresAuth: true,
  },
} as const satisfies Record<string, NavItem>;

export const mainNavigation: readonly NavItem[] = [
  navigationConfig.todos,
  navigationConfig.profile,
  navigationConfig.about,
  navigationConfig.settings,
] as const;

export const mainNavigationItems: readonly NavItem[] = mainNavigation;

export function filterNavigation(
  items: readonly NavItem[],
  isAuthenticated: boolean,
): readonly NavItem[] {
  return items.filter((item) => !item.requiresAuth || isAuthenticated);
}

export type Breadcrumb = {
  readonly href: string;
  readonly label: string;
};

export function getBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      href: currentPath,
      label: capitalize(segment),
    });
  }

  return breadcrumbs;
}

export type NavConfigKey = keyof typeof navigationConfig;
