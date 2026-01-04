import type { RouteConfig, DynamicRouteConfig } from '../lib/router/config-types';
import type { Metadata } from 'next';

/** Постфикс для всех title страниц */
export const TITLE_POSTFIX = ' - Todo App';

/**
 * Application Routes - удобный объект для использования в коде
 * Единственный источник правды для всех констант маршрутов
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ABOUT: '/about',
  TODOS: '/todos',
  WORKSPACES: '/workspaces',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  TODO_DETAIL: (id: string) => `/todos/${id}`,
  TODO_EDIT: (id: string) => `/todos/${id}/edit`,
} as const;

/**
 * Чистые данные конфигурации маршрутов приложения
 * Единственный источник правды для всех данных маршрутизации
 * На новых проектах нужно изменять только этот файл
 */
export const routeConfigData = {
  home: {
    path: ROUTES.HOME,
    public: true,
    metadata: {
      title: 'Home',
      description: 'Welcome to our application',
    } satisfies Metadata,
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Home',
        breadcrumbs: [{ href: ROUTES.HOME, label: 'Home' }],
      },
    },
  } satisfies RouteConfig,

  login: {
    path: ROUTES.LOGIN,
    public: true,
    metadata: {
      title: 'Login',
      description: 'Sign in to your account',
    } satisfies Metadata,
    // Не отображается в навигации для аутентифицированных пользователей
    navigation: {
      label: 'Login',
      order: 0,
      hideWhenAuthenticated: true,
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Login',
        breadcrumbs: [{ href: ROUTES.LOGIN, label: 'Login' }],
      },
    },
  } satisfies RouteConfig,

  about: {
    path: ROUTES.ABOUT,
    public: true,
    metadata: {
      title: 'About',
      description: 'Learn about our application',
    } satisfies Metadata,
    navigation: {
      label: 'About',
      order: 5,
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'About',
        breadcrumbs: [{ href: ROUTES.ABOUT, label: 'About' }],
      },
    },
  } satisfies RouteConfig,

  todos: {
    path: ROUTES.TODOS,
    protected: true,
    metadata: {
      title: 'My Todos',
      description: 'Manage your tasks',
    } satisfies Metadata,
    navigation: {
      label: 'Todos',
      order: 1,
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Todos',
        breadcrumbs: [{ href: ROUTES.TODOS, label: 'Todos' }],
      },
    },
  } satisfies RouteConfig,

  workspaces: {
    path: ROUTES.WORKSPACES,
    protected: true,
    metadata: {
      title: 'Workspaces',
      description: 'Manage your workspaces',
    } satisfies Metadata,
    navigation: {
      label: 'Workspaces',
      order: 2,
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Todos',
        breadcrumbs: [{ href: ROUTES.TODOS, label: 'Todos' }],
      },
    },
  } satisfies RouteConfig,

  profile: {
    path: ROUTES.PROFILE,
    protected: true,
    metadata: {
      title: 'Profile',
      description: 'Manage your account',
    } satisfies Metadata,
    navigation: {
      label: 'Profile',
      order: 4,
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Profile',
        breadcrumbs: [{ href: ROUTES.PROFILE, label: 'Profile' }],
      },
    },
  } satisfies RouteConfig,

  settings: {
    path: ROUTES.SETTINGS,
    protected: true,
    metadata: {
      title: 'Settings',
      description: 'Customize your experience',
    } satisfies Metadata,
    navigation: {
      label: 'Settings',
      order: 3,
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Settings',
        breadcrumbs: [{ href: ROUTES.SETTINGS, label: 'Settings' }],
      },
    },
  } satisfies RouteConfig,
} as const;

/**
 * Чистые данные конфигурации динамических маршрутов
 */
export const dynamicRouteConfigData = {
  todoDetail: {
    path: '/todos/:id',
    protected: true,
    metadata: (title: string): Metadata => ({
      title,
      description: `Details for ${title}`,
    }),
    header: {
      type: 'entity',
      fallback: {
        title: 'Loading todo...',
        breadcrumbs: [
          { href: ROUTES.TODOS, label: 'Todos' },
          { href: '#', label: '...' },
        ],
      },
      build: (todo: { id: string; text: string }) => ({
        title: todo.text,
        breadcrumbs: [
          { href: ROUTES.TODOS, label: 'Todos' },
          { href: ROUTES.TODO_DETAIL(todo.id), label: todo.text },
        ],
      }),
    },
  },
  todoEdit: {
    path: '/todos/:id/edit',
    protected: true,
    metadata: (title: string): Metadata => ({
      title: `Edit: ${title}`,
      description: `Edit details for ${title}`,
    }),
    header: {
      type: 'entity',
      fallback: {
        title: 'Edit Todo',
        breadcrumbs: [
          { href: ROUTES.TODOS, label: 'Todos' },
          { href: '#', label: '...' },
        ],
      },
      build: (todo: { id: string; text: string }) => ({
        title: `Edit: ${todo.text}`,
        breadcrumbs: [
          { href: ROUTES.TODOS, label: 'Todos' },
          { href: ROUTES.TODO_DETAIL(todo.id), label: todo.text },
          { href: ROUTES.TODO_EDIT(todo.id), label: 'Edit' },
        ],
      }),
    },
  },
} as const satisfies Record<string, DynamicRouteConfig>;
