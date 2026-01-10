import { type useRouter } from 'next/navigation';

import { ROUTES } from './index';

/**
 * Типы для генерируемых навигационных функций
 */
export type GeneratedNavigationFunctions = {
  navigateTo: (path: string) => void;
  navigateToHome: () => void;
  navigateToLogin: () => void;
  navigateToAbout: () => void;
  navigateToTodos: () => void;
  navigateToTracker: () => void;
  navigateToWorkspace: () => void;
  navigateToWorkspaceSelect: () => void;
  navigateToWorkspaceManage: () => void;
  navigateToProfile: () => void;
  navigateToSettings: () => void;
  navigateToTodoDetail: (id: string) => void;
  navigateToTodoEdit: (id: string) => void;
  navigateToWorkspaceDashboard: (id: string) => void;
  navigateToWorkspaceTimeEntry: (id: string) => void;
  navigateToWorkspaceReports: (id: string) => void;
  navigateToWorkspaceProjects: (id: string) => void;
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
      const functionName = `navigateTo${key
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
      const functionName = `navigateTo${key
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
    navigateTo: (path: string) => router.push(path),

    // Все сгенерированные функции
    ...staticFunctions,
    ...dynamicFunctions,
  } as GeneratedNavigationFunctions;
}
