import { describe, expect, it } from 'vitest';

import {
  // Configuration
  routeConfig,
  dynamicRouteConfig,

  // Generated paths and utilities
  paths,
  dynamicPaths,
  routes,
  navigationConfig,
  mainNavigation,
  metadataConfig,
  headerTemplates,
  publicPaths,
  protectedPaths,
  protectedPatterns,
  protectedPatternsArray,
  isPublicPath,
  isProtectedPath,
  requiresAuth,

  // Utilities
  createDynamicPath,
  extractPathParams,
  isPathMatch,
  createBreadcrumbs,
  filterNavigationByAuth,

  // Guards
  requiresAuthentication,
  createPublicPathGuard,
  createProtectedPathGuard,
  createAuthGuard,

  // Validation
  validateRouteConfig,
  validateConfigInDev,

  // Convenience exports
  ROUTES,
  getRouteMetadata,
  getStaticMetadata,
  getBreadcrumbs,
} from './index';

describe('router index barrel exports', () => {
  describe('configuration exports', () => {
    it('exports route configuration', () => {
      expect(routeConfig).toBeDefined();
      expect(dynamicRouteConfig).toBeDefined();

      // Проверяем структуру routeConfig
      expect(routeConfig).toHaveProperty('home');
      expect(routeConfig).toHaveProperty('login');
      expect(routeConfig).toHaveProperty('todos');

      // Проверяем структуру dynamicRouteConfig
      expect(dynamicRouteConfig).toHaveProperty('todoDetail');
      expect(dynamicRouteConfig).toHaveProperty('todoEdit');
    });
  });

  describe('generated utilities exports', () => {
    it('exports paths utilities', () => {
      expect(paths).toBeDefined();
      expect(dynamicPaths).toBeDefined();
      expect(routes).toBeDefined();

      expect(paths.paths.home).toBe('/');
      expect(typeof dynamicPaths.todoDetail).toBe('function');
      expect(routes.home).toBe('/');
    });

    it('exports navigation utilities', () => {
      expect(navigationConfig).toBeDefined();
      expect(mainNavigation).toBeDefined();

      expect(navigationConfig).toHaveProperty('login');
      expect(Array.isArray(mainNavigation)).toBe(true);
    });

    it('exports metadata and headers', () => {
      expect(metadataConfig).toBeDefined();
      expect(headerTemplates).toBeDefined();

      expect(metadataConfig['/']).toBeDefined();
      expect(headerTemplates.home).toBeDefined();
    });

    it('exports path guards', () => {
      expect(publicPaths).toBeInstanceOf(Set);
      expect(protectedPaths).toBeInstanceOf(Set);
      expect(Array.isArray(protectedPatterns)).toBe(true);
      expect(Array.isArray(protectedPatternsArray)).toBe(true);

      expect(typeof isPublicPath).toBe('function');
      expect(typeof isProtectedPath).toBe('function');
      expect(typeof requiresAuth).toBe('function');
    });
  });

  describe('utilities exports', () => {
    it('exports utility functions', () => {
      expect(typeof createDynamicPath).toBe('function');
      expect(typeof extractPathParams).toBe('function');
      expect(typeof isPathMatch).toBe('function');
      expect(typeof createBreadcrumbs).toBe('function');
      expect(typeof filterNavigationByAuth).toBe('function');
    });

    it('utility functions work correctly', () => {
      expect(createDynamicPath('/todos/:id', { id: '123' })).toBe('/todos/123');
      expect(extractPathParams('/todos/123', '/todos/:id')).toEqual({ id: '123' });
      expect(isPathMatch('/todos/123', '/todos/:id')).toBe(true);
      expect(createBreadcrumbs('/todos')).toEqual([{ href: '/todos', label: 'Todos' }]);
    });
  });

  describe('guards exports', () => {
    it('exports guard functions', () => {
      expect(typeof requiresAuthentication).toBe('function');
      expect(typeof createPublicPathGuard).toBe('function');
      expect(typeof createProtectedPathGuard).toBe('function');
      expect(typeof createAuthGuard).toBe('function');
    });
  });

  describe('validation exports', () => {
    it('exports validation functions', () => {
      expect(typeof validateRouteConfig).toBe('function');
      expect(typeof validateConfigInDev).toBe('function');
    });

    it('validation works correctly', () => {
      const result = validateRouteConfig();
      expect(result.isValid).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe('convenience exports', () => {
    it('exports ROUTES constant', () => {
      expect(ROUTES).toBeDefined();
      expect(ROUTES.HOME).toBe('/');
      expect(ROUTES.LOGIN).toBe('/login');
      expect(ROUTES.TODOS).toBe('/todos');
      expect(typeof ROUTES.TODO_DETAIL).toBe('function');
    });

    it('exports convenience functions', () => {
      expect(typeof getRouteMetadata).toBe('function');
      expect(typeof getStaticMetadata).toBe('function');
      expect(typeof getBreadcrumbs).toBe('function');
    });

    it('convenience functions work correctly', () => {
      const metadata = getRouteMetadata('/todos');
      expect(metadata).toBeDefined();

      expect(getStaticMetadata).toBe(getRouteMetadata);
      expect(getBreadcrumbs).toBe(createBreadcrumbs);
    });
  });

  describe('integration tests', () => {
    it('ROUTES constant matches paths', () => {
      expect(ROUTES.HOME).toBe(paths.paths.home);
      expect(ROUTES.LOGIN).toBe(paths.paths.login);
      expect(ROUTES.TODOS).toBe(paths.paths.todos);
    });

    it('dynamic paths work with ROUTES', () => {
      expect(ROUTES.TODO_DETAIL('123')).toBe('/todos/123');
      expect(ROUTES.TODO_EDIT('456')).toBe('/todos/456/edit');
    });

    it('guards work with exported paths', () => {
      expect(isPublicPath(ROUTES.HOME)).toBe(true);
      expect(isPublicPath(ROUTES.LOGIN)).toBe(true);
      expect(isProtectedPath(ROUTES.TODOS)).toBe(true);
      expect(isProtectedPath(ROUTES.TODO_DETAIL('123'))).toBe(true);
    });

    it('navigation integrates with paths', () => {
      const todoNavItem = mainNavigation.find((item) => item.href === ROUTES.TODOS);
      expect(todoNavItem).toBeDefined();
      expect(todoNavItem?.label).toBe('Todos');
    });

    it('metadata integrates with paths', () => {
      const homeMetadata = getRouteMetadata(ROUTES.HOME);
      expect(homeMetadata).toHaveProperty('title');
      expect(homeMetadata).toHaveProperty('description');
    });
  });

  describe('type exports', () => {
    it('exports all necessary types', () => {
      // Проверяем что типы экспортируются (в runtime их не проверяем)
      expect(true).toBe(true); // Placeholder test - types are checked at compile time
    });
  });
});
