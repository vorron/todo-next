import { describe, expect, it } from 'vitest';

import {
  requiresAuthentication,
  createPublicPathGuard,
  createProtectedPathGuard,
  createAuthGuard,
} from './guards';

describe('router guards', () => {
  const publicPaths = new Set(['/', '/login', '/about']);
  const protectedPaths = new Set(['/todos', '/profile', '/settings']);
  const protectedPatterns = [/^\/todos\/[^/]+$/, /^\/todos\/[^/]+\/edit$/];

  describe('requiresAuthentication', () => {
    it('returns true for protected static paths', () => {
      expect(requiresAuthentication('/todos', protectedPaths, protectedPatterns)).toBe(true);
      expect(requiresAuthentication('/profile', protectedPaths, protectedPatterns)).toBe(true);
    });

    it('returns true for protected dynamic paths', () => {
      expect(requiresAuthentication('/todos/123', protectedPaths, protectedPatterns)).toBe(true);
      expect(requiresAuthentication('/todos/456/edit', protectedPaths, protectedPatterns)).toBe(
        true,
      );
    });

    it('returns false for public paths', () => {
      expect(requiresAuthentication('/', protectedPaths, protectedPatterns)).toBe(false);
      expect(requiresAuthentication('/login', protectedPaths, protectedPatterns)).toBe(false);
    });

    it('returns false for unknown paths', () => {
      expect(requiresAuthentication('/unknown', protectedPaths, protectedPatterns)).toBe(false);
    });
  });

  describe('createPublicPathGuard', () => {
    it('creates guard that identifies public paths', () => {
      const isPublicPath = createPublicPathGuard(publicPaths);

      expect(isPublicPath('/')).toBe(true);
      expect(isPublicPath('/login')).toBe(true);
      expect(isPublicPath('/todos')).toBe(false);
      expect(isPublicPath('/unknown')).toBe(false);
    });
  });

  describe('createProtectedPathGuard', () => {
    it('creates guard that identifies protected paths', () => {
      const isProtectedPath = createProtectedPathGuard(protectedPaths, protectedPatterns);

      expect(isProtectedPath('/todos')).toBe(true);
      expect(isProtectedPath('/profile')).toBe(true);
      expect(isProtectedPath('/todos/123')).toBe(true);
      expect(isProtectedPath('/todos/456/edit')).toBe(true);
      expect(isProtectedPath('/')).toBe(false);
      expect(isProtectedPath('/login')).toBe(false);
      expect(isProtectedPath('/unknown')).toBe(false);
    });
  });

  describe('createAuthGuard', () => {
    it('creates combined auth guard', () => {
      const requiresAuth = createAuthGuard(protectedPaths, protectedPatterns);

      expect(requiresAuth('/todos')).toBe(true);
      expect(requiresAuth('/todos/123')).toBe(true);
      expect(requiresAuth('/todos/456/edit')).toBe(true);
      expect(requiresAuth('/')).toBe(false);
      expect(requiresAuth('/login')).toBe(false);
      expect(requiresAuth('/unknown')).toBe(false);
    });
  });
});
