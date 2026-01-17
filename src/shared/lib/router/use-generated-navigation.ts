import { type useRouter } from 'next/navigation';

import { ROUTES } from './index';

/**
 * Типы для генерируемых навигационных функций
 */
export type GeneratedNavigationFunctions = {
  to: (path: string) => void;
  toHome: () => void;
  toLogin: () => void;
  toAbout: () => void;
  toTodos: () => void;
  toTracker: () => void;
  toWorkspace: () => void;
  toWorkspaceSelect: () => void;
  toWorkspaceManage: () => void;
  toTrackerOnboarding: () => void;
  toProfile: () => void;
  toSettings: () => void;
  toTodoDetail: (id: string) => void;
  toTodoEdit: (id: string) => void;
  toWorkspaceDashboard: (id: string) => void;
  toWorkspaceTimeEntry: (id: string) => void;
  toWorkspaceReports: (id: string) => void;
  toWorkspaceProjects: (id: string) => void;
};

/**
 * Хук для генерации навигационных функций на основе ROUTES
 * Устраняет дублирование логики из navigation.ts
 */
export function useGeneratedNavigation(
  router: ReturnType<typeof useRouter>,
): GeneratedNavigationFunctions {
  // Разделяем статические и динамические маршруты
  const staticRoutes = Object.entries(ROUTES).filter(([_, route]) => typeof route === 'string');
  const dynamicRoutes = Object.entries(ROUTES).filter(([_, route]) => typeof route === 'function');

  // Генерируем статические функции
  const staticFunctions = staticRoutes.reduce(
    (acc, [key, route]) => {
      const functionName = `to${key
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('')}`;
      acc[functionName] = () => router.push(route as string);
      return acc;
    },
    {} as Record<string, () => void>,
  );

  // Генерируем динамические функции
  const dynamicFunctions = dynamicRoutes.reduce(
    (acc, [key, route]) => {
      const functionName = `to${key
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('')}`;
      acc[functionName] = (id: string) => router.push((route as (id: string) => string)(id));
      return acc;
    },
    {} as Record<string, (id: string) => void>,
  );

  return {
    // Базовая функция
    to: (path: string) => router.push(path),

    // Все сгенерированные функции
    ...staticFunctions,
    ...dynamicFunctions,
  } as GeneratedNavigationFunctions;
}
