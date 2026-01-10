import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { mainNavigation } from './generators';
import {
  getSectionWithChildren,
  getNavigationPath,
  isTopLevelSection,
} from './hierarchical-navigation';

import type { NavigationItem } from './generators';

/**
 * Хук для утилит иерархической навигации
 * Разделение ответственности с useNavigation
 */
export function useHierarchicalNavigation() {
  const router = useRouter();

  return {
    // Утилиты для работы с навигацией
    getMainNavigation: useCallback(() => mainNavigation, []),

    getSectionChildren: useCallback((sectionKey: string) => {
      return getSectionWithChildren(sectionKey);
    }, []),

    getBreadcrumbs: useCallback((currentPath: string) => {
      return getNavigationPath(currentPath);
    }, []),

    isSection: useCallback((item: NavigationItem) => {
      return isTopLevelSection(item);
    }, []),

    // Иерархическая навигация с Next.js router
    navigateToSection: useCallback(
      (sectionKey: string) => {
        router.push(sectionKey);
      },
      [router],
    ),

    navigateToPage: useCallback(
      (pageKey: string) => {
        router.push(pageKey);
      },
      [router],
    ),
  };
}
