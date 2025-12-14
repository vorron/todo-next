export const paths = {
  home: '/',
  login: '/login',
  about: '/about',
  settings: '/settings',
  todos: '/todos',
  profile: '/profile',
} as const;

export const dynamicPaths = {
  todoDetail: (id: string) => `/todos/${id}` as `/todos/${string}`,
  todoEdit: (id: string) => `/todos/${id}/edit` as `/todos/${string}/edit`,
} as const;

export const routes = {
  ...paths,
  ...dynamicPaths,
} as const;

export type StaticPath = (typeof paths)[keyof typeof paths];
export type DynamicPath = ReturnType<(typeof dynamicPaths)[keyof typeof dynamicPaths]>;
export type RoutePath = StaticPath | DynamicPath;
