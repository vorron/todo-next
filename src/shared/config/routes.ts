/**
 * Константы маршрутов приложения
 * Централизованное управление путями с TypeScript поддержкой
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  ABOUT: '/about',
  SETTINGS: '/settings',

  // Protected routes
  TODOS: '/todos',
  PROFILE: '/profile',

  // Dynamic routes
  TODO_DETAIL: (id: string) => `/todos/${id}`,
} as const;

// Type-safe navigation
export type AppRoute = keyof typeof ROUTES;

// Type guard для проверки маршрутов
export function isAppRoute(route: string): route is AppRoute {
  return route in ROUTES;
}

// Вспомогательные функции для навигации
export const navigation = {
  main: [
    { name: 'Todos', href: ROUTES.TODOS, auth: true },
    { name: 'Profile', href: ROUTES.PROFILE, auth: true },
    { name: 'About', href: ROUTES.ABOUT, auth: false },
    { name: 'Settings', href: ROUTES.SETTINGS, auth: true },
  ],

  // Генерация breadcrumbs
  getBreadcrumbs: (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    let currentPath = '';
    for (const segment of segments) {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        href: currentPath,
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
      });
    }

    return breadcrumbs;
  },
} as const;
