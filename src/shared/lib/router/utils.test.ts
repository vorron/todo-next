import { describe, expect, it } from 'vitest';

import {
  createDynamicPath,
  extractPathParams,
  isPathMatch,
  createBreadcrumbs,
  filterNavigationByAuth,
} from './utils';

describe('router utils', () => {
  describe('createDynamicPath', () => {
    it('creates dynamic path with single parameter', () => {
      const result = createDynamicPath('/todos/:id', { id: '123' });
      expect(result).toBe('/todos/123');
    });

    it('creates dynamic path with multiple parameters', () => {
      const result = createDynamicPath('/users/:userId/posts/:postId', {
        userId: '456',
        postId: '789',
      });
      expect(result).toBe('/users/456/posts/789');
    });

    it('handles numeric parameters', () => {
      const result = createDynamicPath('/api/v1/users/:id', { id: 123 });
      expect(result).toBe('/api/v1/users/123');
    });
  });

  describe('extractPathParams', () => {
    it('extracts single parameter', () => {
      const result = extractPathParams('/todos/123', '/todos/:id');
      expect(result).toEqual({ id: '123' });
    });

    it('extracts multiple parameters', () => {
      const result = extractPathParams('/users/456/posts/789', '/users/:userId/posts/:postId');
      expect(result).toEqual({ userId: '456', postId: '789' });
    });

    it('returns empty object for no parameters', () => {
      const result = extractPathParams('/todos', '/todos');
      expect(result).toEqual({});
    });

    it('handles missing parameters gracefully', () => {
      const result = extractPathParams('/todos', '/todos/:id');
      expect(result).toEqual({ id: '' });
    });
  });

  describe('isPathMatch', () => {
    it('matches exact paths', () => {
      expect(isPathMatch('/todos', '/todos')).toBe(true);
    });

    it('matches dynamic paths', () => {
      expect(isPathMatch('/todos/123', '/todos/:id')).toBe(true);
      expect(isPathMatch('/todos/123/edit', '/todos/:id/edit')).toBe(true);
    });

    it('does not match different paths', () => {
      expect(isPathMatch('/todos', '/users')).toBe(false);
      expect(isPathMatch('/todos/123', '/todos/:id/edit')).toBe(false);
    });

    it('does not match paths with different segment counts', () => {
      expect(isPathMatch('/todos/123', '/todos')).toBe(false);
      expect(isPathMatch('/todos', '/todos/:id')).toBe(false);
    });
  });

  describe('createBreadcrumbs', () => {
    it('creates breadcrumbs from simple path', () => {
      const result = createBreadcrumbs('/todos');
      expect(result).toEqual([{ href: '/todos', label: 'Todos' }]);
    });

    it('creates breadcrumbs from nested path', () => {
      const result = createBreadcrumbs('/todos/123/edit');
      expect(result).toEqual([
        { href: '/todos', label: 'Todos' },
        { href: '/todos/123', label: '123' },
        { href: '/todos/123/edit', label: 'Edit' },
      ]);
    });

    it('handles root path', () => {
      const result = createBreadcrumbs('/');
      expect(result).toEqual([]);
    });

    it('uses custom capitalize function', () => {
      const customCapitalize = (str: string) => str.toUpperCase();
      const result = createBreadcrumbs('/todos', customCapitalize);
      expect(result).toEqual([{ href: '/todos', label: 'TODOS' }]);
    });
  });

  describe('filterNavigationByAuth', () => {
    const items = [
      { label: 'Home', href: '/', requiresAuth: false },
      { label: 'Login', href: '/login', requiresAuth: false },
      { label: 'Todos', href: '/todos', requiresAuth: true },
      { label: 'Profile', href: '/profile', requiresAuth: true },
    ] as const;

    it('returns all items for authenticated user', () => {
      const result = filterNavigationByAuth(items, true);
      expect(result).toHaveLength(4);
    });

    it('returns only public items for unauthenticated user', () => {
      const result = filterNavigationByAuth(items, false);
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.label)).toEqual(['Home', 'Login']);
    });

    it('handles items without requiresAuth', () => {
      const itemsWithoutAuth = [
        { label: 'Home', href: '/', requiresAuth: undefined },
        { label: 'Todos', href: '/todos', requiresAuth: true },
      ] as const;

      const result = filterNavigationByAuth(itemsWithoutAuth, false);
      expect(result).toHaveLength(1); // Only items without requiresAuth should be included
      expect(result.map((item) => item.label)).toEqual(['Home']);
    });
  });
});
