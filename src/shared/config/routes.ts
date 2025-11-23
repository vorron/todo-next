/**
 * Константы маршрутов приложения
 * Централизованное управление путями
 */
export const ROUTES = {
  HOME: "/",
  TODOS: "/todos",
  TODO_DETAIL: (id: string) => `/todos/${id}`,
  PROFILE: "/profile",
  ABOUT: "/about",
  LOGIN: "/login",
  SETTINGS: "/settings",
} as const;

export type Route = keyof typeof ROUTES;

/**
 * Вспомогательные функции для навигации
 */
export const navigation = {
  main: [
    { name: 'Todos', href: ROUTES.TODOS },
    { name: 'Profile', href: ROUTES.PROFILE },
  ],
  user: [
    { name: 'Your Profile', href: ROUTES.PROFILE },
    { name: 'Settings', href: ROUTES.SETTINGS },
  ],
} as const;