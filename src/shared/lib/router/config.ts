import { createDynamicPath } from './utils';

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
  };
  header?: HeaderTemplate;
  layout?: 'default' | 'auth' | 'dashboard';
};

type PublicRouteConfig = BaseRouteConfig & { public: true; protected?: never };
type ProtectedRouteConfig = BaseRouteConfig & { protected: true; public?: never };

type RouteConfig = PublicRouteConfig | ProtectedRouteConfig;

/**
 * Единый конфиг маршрутов приложения
 * Один источник правды для всех данных маршрутизации
 */
export const routeConfig = {
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
  } satisfies PublicRouteConfig,

  login: {
    path: '/login' as const,
    public: true,
    metadata: {
      title: 'Login - Todo App',
      description: 'Sign in to your account',
    } satisfies Metadata,
    navigation: {
      label: 'Login',
      order: 0,
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Login',
        breadcrumbs: [{ href: '/login', label: 'Login' }],
      },
    },
  } satisfies PublicRouteConfig,

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
  } satisfies PublicRouteConfig,

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
  } satisfies ProtectedRouteConfig,

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
  } satisfies ProtectedRouteConfig,

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
  } satisfies ProtectedRouteConfig,
} as const satisfies Record<string, RouteConfig>;

/**
 * Конфигурация динамических маршрутов
 */
export const dynamicRouteConfig = {
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
          { href: dynamicPaths.todoDetail(todo.id), label: todo.text },
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
          { href: dynamicPaths.todoDetail(todo.id), label: todo.text },
          { href: dynamicPaths.todoEdit(todo.id), label: 'Edit' },
        ],
      }),
    },
  },
} as const;

/**
 * Конкретные данные приложения для динамических маршрутов
 */
export const dynamicPaths = {
  todoDetail: (id: string) => createDynamicPath('/todos/:id', { id }),
  todoEdit: (id: string) => createDynamicPath('/todos/:id/edit', { id }),
} as const;

/**
 * Конкретные данные приложения для динамических метаданных
 */
export const dynamicMetadata = {
  todoDetail: dynamicRouteConfig.todoDetail.metadata,
  todoEdit: dynamicRouteConfig.todoEdit.metadata,
} as const;

/**
 * Конкретные паттерны для защиты маршрутов
 */
export const protectedPatterns = [/^\/todos\/[^/]+$/, /^\/todos\/[^/]+\/edit$/] as const;

// === Generated Types ===
export type RouteKey = keyof typeof routeConfig;
export type DynamicRouteKey = keyof typeof dynamicRouteConfig;
export type AllRouteKey = RouteKey | DynamicRouteKey;

// === App Types for Convenience ===
export type AppStaticPath = string;
export type AppDynamicPath = string;
export type AppRoutePath = AppStaticPath | AppDynamicPath;
