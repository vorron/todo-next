/**
 * Hierarchical Navigation Utils - утилиты для работы с иерархической навигацией
 * Поддержка уровней (section/page), parent-child отношений
 */

import { navigationConfig, type NavigationItem } from './generators';

/**
 * Получить все дочерние элементы для указанного родителя
 */
export function getChildNavigation(parentKey: string): NavigationItem[] {
  const allNavigation = Object.values(navigationConfig);

  return allNavigation.filter((item) => item.parent === parentKey);
}

/**
 * Получить все разделы (level: 'section')
 */
export function getSectionNavigation(): NavigationItem[] {
  const allNavigation = Object.values(navigationConfig);

  return allNavigation.filter((item) => item.level === 'section');
}

/**
 * Получить все страницы (level: 'page')
 */
export function getPageNavigation(): NavigationItem[] {
  const allNavigation = Object.values(navigationConfig);

  return allNavigation.filter((item) => item.level === 'page');
}

/**
 * Получить полный путь навигации (breadcrumbs)
 */
export function getNavigationPath(key: string): NavigationItem[] {
  const allNavigation = Object.values(navigationConfig);
  const item = allNavigation.find((item) => item.href === key || item.href.includes(key));

  if (!item) return [];

  const path: NavigationItem[] = [item];

  // Рекурсивно ищем родительские элементы
  if (item.parent) {
    const parentPath = getNavigationPath(item.parent);
    path.unshift(...parentPath);
  }

  return path;
}

/**
 * Проверить, является ли элемент разделом верхнего уровня
 */
export function isTopLevelSection(item: NavigationItem): boolean {
  return item.level === 'section' && !item.parent;
}

/**
 * Получить раздел с дочерними элементами
 */
export function getSectionWithChildren(sectionKey: string): {
  section: NavigationItem | null;
  children: NavigationItem[];
} {
  const section = Object.values(navigationConfig).find(
    (item) => item.href === sectionKey || item.href.includes(sectionKey),
  );

  if (!section) {
    return { section: null, children: [] };
  }

  const children = getChildNavigation(sectionKey);

  return { section, children };
}
