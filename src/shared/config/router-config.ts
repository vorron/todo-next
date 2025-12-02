import { ROUTES } from './routes';

export const ROUTE_CONFIG = {
  [ROUTES.HOME]: {
    metadata: {
      title: 'Home - Todo App',
      description: 'Welcome to our application',
    },
  },
  [ROUTES.LOGIN]: {
    metadata: {
      title: 'Login - Todo App',
      description: 'Sign in to your account',
    },
  },
  [ROUTES.ABOUT]: {
    metadata: {
      title: 'About - Todo App',
      description: 'Learn about our application',
    },
  },
  [ROUTES.TODOS]: {
    metadata: {
      title: 'My Todos - Todo App',
      description: 'Manage your tasks',
    },
  },
  [ROUTES.PROFILE]: {
    metadata: {
      title: 'Profile - Todo App',
      description: 'Manage your account',
    },
  },
  [ROUTES.SETTINGS]: {
    metadata: {
      title: 'Settings - Todo App',
      description: 'Customize your experience',
    },
  },
  // Динамические маршруты не включаем в метаданные - они генерируются отдельно
} as const;

type RouteConfig = typeof ROUTE_CONFIG;
export type StaticRoute = keyof RouteConfig;
