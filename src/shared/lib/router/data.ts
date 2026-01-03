import type { RouteConfig, DynamicRouteConfig } from './config-types';
import type { Metadata } from 'next';

/**
 * Чистые данные конфигурации маршрутов приложения
 * Единственный источник правды для всех данных маршрутизации
 * На новых проектах нужно изменять только этот файл
 */
export const routeConfigData = {
  // Public routes
  home: {
    path: '/' as const,
    public: true,
    metadata: {
      title: 'Home - Todo App',
      description: 'Welcome to our application',
    } satisfies Metadata,
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Home',
        breadcrumbs: [{ href: '/', label: 'Home' }],
      },
    },
  } satisfies RouteConfig,

  login: {
    path: '/login' as const,
    public: true,
    metadata: {
      title: 'Login - Todo App',
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
        breadcrumbs: [{ href: '/login', label: 'Login' }],
      },
    },
  } satisfies RouteConfig,

  about: {
    path: '/about' as const,
    public: true,
    metadata: {
      title: 'About - Todo App',
      description: 'Learn about our application',
    } satisfies Metadata,
    navigation: {
      label: 'About',
      order: 4,
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'About',
        breadcrumbs: [{ href: '/about', label: 'About' }],
      },
    },
  } satisfies RouteConfig,

  // Protected routes
  todos: {
    path: '/todos' as const,
    protected: true,
    metadata: {
      title: 'My Todos - Todo App',
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
        breadcrumbs: [{ href: '/todos', label: 'Todos' }],
      },
    },
  } satisfies RouteConfig,

  profile: {
    path: '/profile' as const,
    protected: true,
    metadata: {
      title: 'Profile - Todo App',
      description: 'Manage your account',
    } satisfies Metadata,
    navigation: {
      label: 'Profile',
      order: 3,
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Profile',
        breadcrumbs: [{ href: '/profile', label: 'Profile' }],
      },
    },
  } satisfies RouteConfig,

  settings: {
    path: '/settings' as const,
    protected: true,
    metadata: {
      title: 'Settings - Todo App',
      description: 'Customize your experience',
    } satisfies Metadata,
    navigation: {
      label: 'Settings',
      order: 2,
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Settings',
        breadcrumbs: [{ href: '/settings', label: 'Settings' }],
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
      title: `${title} - Todo App`,
      description: `Details for ${title}`,
    }),
    header: {
      type: 'entity',
      fallback: {
        title: 'Loading todo...',
        breadcrumbs: [
          { href: '/todos', label: 'Todos' },
          { href: '#', label: '...' },
        ],
      },
      build: (todo: { id: string; text: string }) => ({
        title: todo.text,
        breadcrumbs: [
          { href: '/todos', label: 'Todos' },
          { href: `/todos/${todo.id}`, label: todo.text },
        ],
      }),
    },
  },
  todoEdit: {
    path: '/todos/:id/edit',
    protected: true,
    metadata: (title: string): Metadata => ({
      title: `Edit: ${title} - Todo App`,
      description: `Edit details for ${title}`,
    }),
    header: {
      type: 'entity',
      fallback: {
        title: 'Edit Todo',
        breadcrumbs: [
          { href: '/todos', label: 'Todos' },
          { href: '#', label: '...' },
        ],
      },
      build: (todo: { id: string; text: string }) => ({
        title: `Edit: ${todo.text}`,
        breadcrumbs: [
          { href: '/todos', label: 'Todos' },
          { href: `/todos/${todo.id}`, label: todo.text },
          { href: `/todos/${todo.id}/edit`, label: 'Edit' },
        ],
      }),
    },
  },
} as const satisfies Record<string, DynamicRouteConfig>;
