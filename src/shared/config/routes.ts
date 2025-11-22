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
} as const;

export type Route = keyof typeof ROUTES;
