import type { RouteParams, Breadcrumb } from './types';

/**
 * Создает динамический путь с параметрами
 */
export function createDynamicPath<T extends RouteParams>(template: string, params: T): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, String(value)),
    template,
  );
}

/**
 * Извлекает параметры из пути
 */
export function extractPathParams(path: string, template: string): Record<string, string> {
  const params: Record<string, string> = {};
  const pathSegments = path.split('/').filter(Boolean);
  const templateSegments = template.split('/').filter(Boolean);

  templateSegments.forEach((segment, i) => {
    if (segment.startsWith(':')) {
      params[segment.slice(1)] = pathSegments[i] || '';
    }
  });

  return params;
}

/**
 * Проверяет, соответствует ли путь шаблону
 */
export function isPathMatch(path: string, template: string): boolean {
  const pathSegments = path.split('/').filter(Boolean);
  const templateSegments = template.split('/').filter(Boolean);

  if (pathSegments.length !== templateSegments.length) {
    return false;
  }

  return templateSegments.every((segment, index) => {
    const pathSegment = pathSegments[index];
    return segment.startsWith(':') || segment === pathSegment;
  });
}

/**
 * Создает хлебные крошки для пути
 */
export function createBreadcrumbs(
  pathname: string,
  capitalizeFn: (str: string) => string = (str) => str.charAt(0).toUpperCase() + str.slice(1),
): Breadcrumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      href: currentPath,
      label: capitalizeFn(segment),
    });
  }

  return breadcrumbs;
}

/**
 * Фильтрует навигационные элементы по правам доступа
 */
export function filterNavigationByAuth<T extends { requiresAuth?: boolean }>(
  items: readonly T[],
  isAuthenticated: boolean,
): readonly T[] {
  return items.filter((item) => !item.requiresAuth || isAuthenticated);
}
