/**
 * Guards для маршрутизации - общая логика, переиспользуемая между проектами
 */

/**
 * Проверяет, требует ли путь аутентификации
 */
export function requiresAuthentication(
  path: string,
  protectedPaths: Set<string>,
  protectedPatterns: RegExp[],
): boolean {
  if (protectedPaths.has(path)) return true;
  return protectedPatterns.some((pattern) => pattern.test(path));
}

/**
 * Создает guard для публичных путей
 */
export function createPublicPathGuard(publicPaths: Set<string>) {
  return function isPublicPath(path: string): boolean {
    return publicPaths.has(path);
  };
}

/**
 * Создает guard для защищенных путей
 */
export function createProtectedPathGuard(protectedPaths: Set<string>, protectedPatterns: RegExp[]) {
  return function isProtectedPath(path: string): boolean {
    if (protectedPaths.has(path)) return true;
    return protectedPatterns.some((pattern) => pattern.test(path));
  };
}

/**
 * Создает комбинированный guard для проверки аутентификации
 */
export function createAuthGuard(protectedPaths: Set<string>, protectedPatterns: RegExp[]) {
  return function requiresAuth(path: string): boolean {
    return requiresAuthentication(path, protectedPaths, protectedPatterns);
  };
}
