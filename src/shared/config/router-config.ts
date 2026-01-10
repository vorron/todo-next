import { route, dynamicRoute } from '../lib/router/builders';

/** Постфикс для всех title страниц */
export const TITLE_POSTFIX = ' - Todo App';

export const BASE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  ABOUT: '/about',
  TODOS: '/todos',
  TRACKER: '/tracker',
  TRACKER_SELECT: '/tracker/select',
  TRACKER_MANAGE: '/tracker/manage',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const DYNAMIC_PATH_TEMPLATES = {
  TODO_DETAIL: '/todos/:id',
  TODO_EDIT: '/todos/:id/edit',
  TRACKER_DASHBOARD: '/tracker/:id',
  TRACKER_TIME_ENTRY: '/tracker/:id/time-entry',
  TRACKER_REPORTS: '/tracker/:id/reports',
  TRACKER_PROJECTS: '/tracker/:id/projects',
} as const;

export const routeConfigData = {
  home: route({
    path: BASE_PATHS.HOME,
    public: true,
    title: 'Home',
    description: 'Welcome to our application',
  }),

  login: route({
    path: BASE_PATHS.LOGIN,
    public: true,
    title: 'Login',
    description: 'Sign in to your account',
    nav: {
      label: 'Login',
      hideWhenAuthenticated: true,
    },
  }),

  about: route({
    path: BASE_PATHS.ABOUT,
    public: true,
    title: 'About',
    description: 'Learn more about our application',
    nav: {
      label: 'About',
      order: 6,
    },
  }),

  todos: route({
    path: BASE_PATHS.TODOS,
    protected: true,
    title: 'Todos',
    description: 'Manage your todos',
    nav: {
      label: 'Todos',
      order: 1,
      level: 'section',
    },
  }),

  tracker: route({
    path: BASE_PATHS.TRACKER,
    protected: true,
    title: 'Tracker',
    description: 'Time tracking and workspace management',
    nav: {
      label: 'Tracker',
      order: 2,
      level: 'section',
    },
  }),

  profile: route({
    path: BASE_PATHS.PROFILE,
    protected: true,
    title: 'Profile',
    description: 'Manage your account',
    nav: {
      label: 'Profile',
      order: 5,
    },
  }),

  settings: route({
    path: BASE_PATHS.SETTINGS,
    protected: true,
    title: 'Settings',
    description: 'Configure your preferences',
    nav: {
      label: 'Settings',
      order: 3,
    },
  }),
} as const;

/**
 * Чистые данные конфигурации динамических маршрутов
 * Использует новый упрощенный синтаксис с builder-функциями
 */
export const dynamicRouteConfigData = {
  todoDetail: dynamicRoute({
    path: DYNAMIC_PATH_TEMPLATES.TODO_DETAIL,
    protected: true,
    title: (todo: { id: string; text: string }) => todo.text,
    parent: 'todos',
    fallbackTitle: 'Loading todo...',
  }),

  todoEdit: dynamicRoute({
    path: DYNAMIC_PATH_TEMPLATES.TODO_EDIT,
    protected: true,
    title: (todo: { id: string; text: string }) => `Edit: ${todo.text}`,
    parent: 'todos',
    fallbackTitle: 'Edit Todo',
  }),

  workspaceReports: dynamicRoute({
    path: DYNAMIC_PATH_TEMPLATES.TRACKER_REPORTS,
    protected: true,
    title: (data: { id: string; text: string }) => `${data.text} - Reports`,
    description: (data: { id: string; text: string }) => `Analytics and insights for ${data.text}`,
    parent: 'tracker',
    fallbackTitle: 'Workspace Reports',
  }),

  workspaceDashboard: dynamicRoute({
    path: DYNAMIC_PATH_TEMPLATES.TRACKER_DASHBOARD,
    protected: true,
    title: (data: { id: string; text: string }) => data.text,
    description: (data: { id: string; text: string }) => `Workspace dashboard for ${data.text}`,
    parent: 'tracker',
    fallbackTitle: 'Workspace Dashboard',
  }),

  workspaceProjects: dynamicRoute({
    path: DYNAMIC_PATH_TEMPLATES.TRACKER_PROJECTS,
    protected: true,
    title: (data: { id: string; text: string }) => `${data.text} - Projects`,
    description: (data: { id: string; text: string }) => `Projects for ${data.text}`,
    parent: 'tracker',
    fallbackTitle: 'Workspace Projects',
  }),

  workspaceTimeEntry: dynamicRoute({
    path: DYNAMIC_PATH_TEMPLATES.TRACKER_TIME_ENTRY,
    protected: true,
    title: (data: { id: string; text: string }) => `${data.text} - Time Entry`,
    description: (data: { id: string; text: string }) => `Time tracking for ${data.text}`,
    parent: 'tracker',
    fallbackTitle: 'Time Entry',
  }),
} as const;
