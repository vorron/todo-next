'use client';

import { useRouter } from 'next/navigation';

import { ROUTES, type NavigationFunctions } from '../../config/router-config';

/**
 * Навигационный hook для приложения
 * Специфичная реализация для данного приложения
 */
export function useNavigation(): NavigationFunctions {
  const router = useRouter();

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
  } as NavigationFunctions;
}

// Экспортируем типы для удобного использования
export type { NavigationFunctions };
