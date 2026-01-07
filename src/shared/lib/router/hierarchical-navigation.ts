/**
 * Hierarchical Navigation Utils - утилиты для работы с иерархической навигацией
 * Поддержка уровней (section/page), parent-child отношений и default state редиректов
 */

import { navigationConfig, statefulNavigationConfig, type NavigationItem } from './generators';
import { statefulRouteConfigData } from '../../config/router-config';

/**
 * Получить все дочерние элементы для указанного родителя
 */
export function getChildNavigation(parentKey: string): NavigationItem[] {
  const allNavigation = [
    ...Object.values(navigationConfig),
    ...Object.values(statefulNavigationConfig),
  ];

  return allNavigation.filter((item) => item.parent === parentKey);
}

/**
 * Получить все разделы (level: 'section')
 */
export function getSectionNavigation(): NavigationItem[] {
  const allNavigation = [
    ...Object.values(navigationConfig),
    ...Object.values(statefulNavigationConfig),
  ];

  return allNavigation.filter((item) => item.level === 'section');
}

/**
 * Получить все страницы (level: 'page')
 */
export function getPageNavigation(): NavigationItem[] {
  const allNavigation = [
    ...Object.values(navigationConfig),
    ...Object.values(statefulNavigationConfig),
  ];

  return allNavigation.filter((item) => item.level === 'page');
}

/**
 * Получить полный путь навигации (breadcrumbs)
 */
export function getNavigationPath(key: string): NavigationItem[] {
  const allNavigation = [
    ...Object.values(navigationConfig),
    ...Object.values(statefulNavigationConfig),
  ];
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
 * Получить URL для default state у stateful маршрута
 */
export function getDefaultStateUrl(basePath: string): string {
  const statefulConfig = Object.values(statefulRouteConfigData).find(
    (config) => config.path === basePath,
  );

  if (!statefulConfig) return basePath;

  const defaultState = statefulConfig.defaultState;
  const stateConfig = statefulConfig.states[defaultState as keyof typeof statefulConfig.states];

  // Если у состояния есть urlPattern, используем его
  if ('urlPattern' in stateConfig && stateConfig.urlPattern) {
    return stateConfig.urlPattern;
  }

  // Иначе используем базовый путь
  return basePath;
}

/**
 * Проверить, нужно ли редиректить на default state
 */
export function needsDefaultStateRedirect(path: string): boolean {
  const statefulConfig = Object.values(statefulRouteConfigData).find(
    (config) => config.path === path,
  );

  if (!statefulConfig) return false;

  // Если путь совпадает с базовым путем и есть defaultState, нужен редирект
  return path === statefulConfig.path && statefulConfig.defaultState !== undefined;
}

/**
 * Получить все доступные состояния для stateful маршрута
 */
export function getStatefulStates(
  basePath: string,
): Array<{ key: string; label: string; href: string }> {
  const statefulConfig = Object.values(statefulRouteConfigData).find(
    (config) => config.path === basePath,
  );

  if (!statefulConfig) return [];

  return Object.entries(statefulConfig.states).map(([key, state]) => ({
    key,
    label: (('navigation' in state &&
      (state as { navigation: { label: string } }).navigation?.label) ||
      key) as string,
    href: (('urlPattern' in state && (state as { urlPattern: string }).urlPattern) ||
      basePath) as string,
  }));
}

/**
 * Получить родительский раздел для страницы
 */
export function getParentSection(key: string): NavigationItem | null {
  const allNavigation = [
    ...Object.values(navigationConfig),
    ...Object.values(statefulNavigationConfig),
  ];
  const item = allNavigation.find((item) => item.href === key || item.href.includes(key));

  if (!item || !item.parent) return null;

  return allNavigation.find((navItem) => navItem.href === item.parent) || null;
}

/**
 * Проверить, является ли маршрут разделом верхнего уровня
 */
export function isTopLevelSection(key: string): boolean {
  const allNavigation = [
    ...Object.values(navigationConfig),
    ...Object.values(statefulNavigationConfig),
  ];
  const item = allNavigation.find((item) => item.href === key || item.href.includes(key));

  return item?.level === 'section' && !item.parent;
}

/**
 * Получить навигацию для конкретного раздела (включая дочерние элементы)
 */
export function getSectionWithChildren(sectionKey: string): {
  section: NavigationItem | null;
  children: NavigationItem[];
} {
  const allNavigation = [
    ...Object.values(navigationConfig),
    ...Object.values(statefulNavigationConfig),
  ];
  const section = allNavigation.find(
    (item) => item.href === sectionKey && item.level === 'section',
  );

  if (!section) {
    return { section: null, children: [] };
  }

  const children = allNavigation.filter((item) => item.parent === sectionKey);

  return { section, children };
}
