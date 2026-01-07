import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { mainNavigation } from './generators';
import {
  getDefaultStateUrl,
  getSectionWithChildren,
  getNavigationPath,
  isTopLevelSection,
} from './hierarchical-navigation';

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

    isSection: useCallback((key: string) => {
      return isTopLevelSection(key);
    }, []),

    // Иерархическая навигация с Next.js router
    navigateToSection: useCallback(
      (sectionKey: string) => {
        const defaultUrl = getDefaultStateUrl(sectionKey);
        router.push(defaultUrl);
      },
      [router],
    ),

    navigateToPage: useCallback(
      (pageKey: string) => {
        router.push(pageKey);
      },
      [router],
    ),

    navigateToDefaultState: useCallback(
      (basePath: string) => {
        const defaultUrl = getDefaultStateUrl(basePath);
        router.push(defaultUrl);
      },
      [router],
    ),
  };
}
