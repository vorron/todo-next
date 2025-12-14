import { paths } from './paths';

export const publicPaths = new Set<string>([paths.home, paths.login, paths.about]);

export const protectedPaths = new Set<string>([paths.todos, paths.profile, paths.settings]);

const protectedPatterns = [/^\/todos\/[^/]+$/, /^\/todos\/[^/]+\/edit$/] as const;

export function isPublicPath(path: string): boolean {
  return publicPaths.has(path);
}

export function isProtectedPath(path: string): boolean {
  if (protectedPaths.has(path)) return true;
  return protectedPatterns.some((pattern) => pattern.test(path));
}

export function requiresAuth(path: string): boolean {
  return isProtectedPath(path);
}
