import type { NavigationItem } from './generators';

/**
 * Generic navigation filter to eliminate duplication
 * Параметризованная функция для фильтрации навигационных элементов
 */

export interface NavigationFilterOptions {
  includeHiddenWhenAuthenticated?: boolean;
  includeHiddenFromMainMenu?: boolean;
  includePages?: boolean;
}

/**
 * Создает фильтр для навигационных элементов на основе опций
 */
export function createNavigationFilter(options: NavigationFilterOptions = {}) {
  const {
    includeHiddenWhenAuthenticated = false,
    includeHiddenFromMainMenu = false,
    includePages = true,
  } = options;

  return function filterNavigation(items: NavigationItem[]) {
    return items
      .filter((item) => includeHiddenWhenAuthenticated || !item.hideWhenAuthenticated)
      .filter((item) => includeHiddenFromMainMenu || !item.hideFromMainMenu)
      .filter((item) => includePages || item.level !== 'page');
  };
}

/**
 * Фильтр для главного меню (только разделы, без страниц)
 */
export const mainNavigationFilter = createNavigationFilter({
  includePages: false,
});

/**
 * Фильтр для навигации раздела (включая страницы)
 */
export const sectionNavigationFilter = createNavigationFilter({
  includePages: true,
});
