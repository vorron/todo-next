'use client';

import { useRouter } from 'next/navigation';

import { useGeneratedNavigation } from './use-generated-navigation';
import { useHierarchicalNavigation } from './use-hierarchical-navigation';

/**
 * Расширенные навигационные функции с поддержкой иерархии
 * Композиция двух хуков для разделения ответственности
 */
export type ExtendedNavigationFunctions = ReturnType<typeof useGeneratedNavigation> &
  ReturnType<typeof useHierarchicalNavigation>;

/**
 * Навигационный hook для приложения
 * Специфичная реализация для данного приложения с поддержкой иерархии
 */
export function useNavigation(): ExtendedNavigationFunctions {
  const router = useRouter();

  // Базовые навигационные функции из ROUTES
  const baseNavigation = useGeneratedNavigation(router);

  // Утилиты иерархической навигации
  const hierarchicalNavigation = useHierarchicalNavigation();

  return {
    ...baseNavigation,
    ...hierarchicalNavigation,
  } as ExtendedNavigationFunctions;
}
