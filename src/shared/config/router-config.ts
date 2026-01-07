import type {
  RouteConfig,
  DynamicRouteConfig,
  StatefulRouteConfig,
  HeaderDescriptor,
} from '../lib/router/config-types';
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
  TRACKER: '/tracker', // Tracker section implemented as workspace functionality
  WORKSPACE: '/tracker',
  WORKSPACE_CREATE: '/workspace/create',
  WORKSPACE_SELECT: '/workspace/select',
  WORKSPACE_MANAGE: '/tracker/manage',
  WORKSPACE_DASHBOARD: (id: string) => `/tracker/${id}`,
  WORKSPACE_TIME_ENTRY: (id: string) => `/tracker/${id}/time-entry`, // Direct time entry URL
  WORKSPACE_REPORTS: (id: string) => `/tracker/${id}/reports`,
  WORKSPACE_PROJECTS: (id: string) => `/tracker/${id}/projects`,
  PROFILE: '/profile',
  SETTINGS: '/settings',
  TODO_DETAIL: (id: string) => `/todos/${id}`,
  TODO_EDIT: (id: string) => `/todos/${id}/edit`,
} as const;

/**
 * Явные алиасы для понимания связей между концепциями
 */
export const ROUTE_ALIASES = {
  // Tracker UI concept maps to workspace implementation
  TRACKER_TO_WORKSPACE: '/tracker',
} as const;

/**
 * Типы навигационных функций - специфичные для приложения
 * Генерируются на основе ROUTES для данного приложения
 */
export type NavigationFunctions = {
  navigateTo: (path: string) => void;
  // Статические маршруты
  navigateToHome: () => void;
  navigateToLogin: () => void;
  navigateToAbout: () => void;
  navigateToTodos: () => void;
  navigateToTracker: () => void;
  navigateToWorkspace: () => void;
  navigateToWorkspaceCreate: () => void;
  navigateToWorkspaceSelect: () => void;
  navigateToProfile: () => void;
  navigateToTimeEntry: () => void;
  navigateToSettings: () => void;
  // Динамические маршруты
  navigateToWorkspaceDashboard: (id: string) => void;
  navigateToWorkspaceTimeEntry: (id: string) => void;
  navigateToTodoDetail: (id: string) => void;
  navigateToTodoEdit: (id: string) => void;
};

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
        breadcrumbs: [{ href: ROUTES.HOME, label: 'Home' }] as Array<{
          href: string;
          label: string;
        }>,
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
    navigation: {
      label: 'Login',
      hideWhenAuthenticated: true, // Скрывать для авторизованных
      // order не нужен для скрытых маршрутов
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Login',
        breadcrumbs: [{ href: ROUTES.LOGIN, label: 'Login' }] as Array<{
          href: string;
          label: string;
        }>,
      },
    },
  } satisfies RouteConfig,

  about: {
    path: ROUTES.ABOUT,
    public: true,
    metadata: {
      title: 'About',
      description: 'Learn more about our application',
    } satisfies Metadata,
    navigation: {
      label: 'About',
      order: 6, // About последним
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'About',
        breadcrumbs: [
          { href: ROUTES.HOME, label: 'Home' },
          { href: ROUTES.ABOUT, label: 'About' },
        ] as Array<{ href: string; label: string }>,
      },
    },
  } satisfies RouteConfig,

  todos: {
    path: ROUTES.TODOS,
    protected: true,
    metadata: {
      title: 'Todos',
      description: 'Manage your todos',
    } satisfies Metadata,
    navigation: {
      label: 'Todos',
      order: 1, // Todos первым после Login
      level: 'section', // Это раздел верхнего уровня
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Todos',
        breadcrumbs: [{ href: ROUTES.TODOS, label: 'Todos' }] as Array<{
          href: string;
          label: string;
        }>,
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
      order: 5, // Profile перед About
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Profile',
        breadcrumbs: [{ href: ROUTES.PROFILE, label: 'Profile' }] as Array<{
          href: string;
          label: string;
        }>,
      },
    },
  } satisfies RouteConfig,

  settings: {
    path: ROUTES.SETTINGS,
    protected: true,
    metadata: {
      title: 'Settings',
      description: 'Configure your preferences',
    } satisfies Metadata,
    navigation: {
      label: 'Settings',
      order: 3, // Settings после Tracker
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Settings',
        breadcrumbs: [{ href: ROUTES.SETTINGS, label: 'Settings' }] as Array<{
          href: string;
          label: string;
        }>,
      },
    },
  } satisfies RouteConfig,
} as const satisfies Record<string, RouteConfig>;

/**
 * Stateful маршруты - для маршрутов с несколькими состояниями
 * Поддерживают client-side навигацию внутри одного URL
 */
export const statefulRouteConfigData = {
  workspace: {
    path: ROUTES.WORKSPACE,
    protected: true,
    metadata: {
      title: 'Workspace',
      description: 'Manage your workspaces',
    } satisfies Metadata,
    navigation: {
      label: 'Tracker', // UI shows "Tracker" but implements workspace functionality
      order: 2, // После Todos
      level: 'section', // Это раздел верхнего уровня
    },
    header: {
      type: 'static' as const,
      descriptor: {
        title: 'Workspace',
        breadcrumbs: [{ href: ROUTES.WORKSPACE, label: 'Workspace' }],
      },
    },
    states: {
      loading: {
        key: 'loading',
        metadata: () => ({ title: 'Loading...' }) satisfies Metadata,
        header: {
          type: 'static' as const,
          descriptor: {
            title: 'Loading...',
            breadcrumbs: [{ href: ROUTES.WORKSPACE, label: 'Workspace' }] as Array<{
              href: string;
              label: string;
            }>,
          },
        },
      },
      create: {
        key: 'create',
        urlPattern: '/workspace/create',
        metadata: () => ({ title: 'Create Workspace' }) satisfies Metadata,
        header: {
          type: 'static' as const,
          descriptor: {
            title: 'Create Workspace',
            breadcrumbs: [
              { href: ROUTES.WORKSPACE, label: 'Workspaces' },
              { href: ROUTES.WORKSPACE_CREATE, label: 'Create' },
            ] as Array<{ href: string; label: string }>,
          },
        },
      },
      select: {
        key: 'select',
        urlPattern: '/workspace/select',
        metadata: () => ({ title: 'Select Workspace' }) satisfies Metadata,
        header: {
          type: 'static' as const,
          descriptor: {
            title: 'Select Workspace',
            breadcrumbs: [
              { href: ROUTES.WORKSPACE, label: 'Workspaces' },
              { href: ROUTES.WORKSPACE_SELECT, label: 'Select' },
            ] as Array<{ href: string; label: string }>,
          },
        },
      },
      'time-entry': {
        key: 'time-entry',
        urlPattern: '/workspace/[id]/time-entry',
        metadata: () => ({ title: 'Time Entry' }) satisfies Metadata,
        header: {
          type: 'entity' as const,
          fallback: {
            title: 'Time Entry',
            breadcrumbs: [
              { href: ROUTES.WORKSPACE, label: 'Workspaces' },
              { href: '#', label: 'Time Entry' },
            ] as Array<{ href: string; label: string }>,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          build: (data: any) =>
            ({
              title: `Time Entry - ${data.name}`,
              breadcrumbs: [
                { href: ROUTES.WORKSPACE, label: 'Workspaces' },
                { href: `/workspace/${data.id}/time-entry`, label: `Time Entry - ${data.name}` },
              ] as Array<{ href: string; label: string }>,
            }) satisfies HeaderDescriptor,
        },
      },
      dashboard: {
        key: 'dashboard',
        urlPattern: '/workspace/:id',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: (_data: any) =>
          ({
            title: `Workspace Dashboard`,
          }) satisfies Metadata,
        header: {
          type: 'entity' as const,
          fallback: {
            title: 'Workspace Dashboard',
            breadcrumbs: [
              { href: ROUTES.WORKSPACE, label: 'Workspaces' },
              { href: '#', label: 'Dashboard' },
            ] as Array<{ href: string; label: string }>,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          build: (data: any) =>
            ({
              title: data.name,
              breadcrumbs: [
                { href: ROUTES.WORKSPACE, label: 'Workspaces' },
                { href: ROUTES.WORKSPACE_DASHBOARD(data.workspaceId), label: data.name },
              ] as Array<{ href: string; label: string }>,
            }) satisfies HeaderDescriptor,
        },
      },
    },
    defaultState: 'loading' as const,
    syncWithUrl: false, // Явный client-side подход без URL синхронизации
    fallbackState: 'loading' as const,
  },
} as const satisfies Record<string, StatefulRouteConfig>;

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
