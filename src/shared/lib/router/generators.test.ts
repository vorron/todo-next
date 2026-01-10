import { describe, expect, it } from 'vitest';

import {
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
  ROUTES,
} from './generators';

describe('router generators', () => {
  describe('ROUTES generator', () => {
    it('generates static routes with SNAKE_CASE keys', () => {
      expect(ROUTES).toHaveProperty('HOME', '/');
      expect(ROUTES).toHaveProperty('LOGIN', '/login');
      expect(ROUTES).toHaveProperty('ABOUT', '/about');
      expect(ROUTES).toHaveProperty('TODOS', '/todos');
      expect(ROUTES).toHaveProperty('PROFILE', '/profile');
      expect(ROUTES).toHaveProperty('SETTINGS', '/settings');
    });

    it('generates dynamic routes with functions', () => {
      expect(typeof ROUTES.TODO_DETAIL).toBe('function');
      expect(typeof ROUTES.TODO_EDIT).toBe('function');
      expect(typeof ROUTES.WORKSPACE_DASHBOARD).toBe('function');
      expect(typeof ROUTES.WORKSPACE_TIME_ENTRY).toBe('function');
      expect(typeof ROUTES.WORKSPACE_REPORTS).toBe('function');
      expect(typeof ROUTES.WORKSPACE_PROJECTS).toBe('function');

      // Проверяем, что функции работают корректно
      const todoDetailFn = ROUTES.TODO_DETAIL as (id: string) => string;
      const todoEditFn = ROUTES.TODO_EDIT as (id: string) => string;

      expect(todoDetailFn('123')).toBe('/todos/123');
      expect(todoEditFn('456')).toBe('/todos/456/edit');
    });

    it('creates correct dynamic route paths', () => {
      expect((ROUTES.TODO_DETAIL as (id: string) => string)('123')).toBe('/todos/123');
      expect((ROUTES.TODO_EDIT as (id: string) => string)('456')).toBe('/todos/456/edit');
      expect((ROUTES.WORKSPACE_DASHBOARD as (id: string) => string)('workspace-1')).toBe(
        '/tracker/workspace-1',
      );
      expect((ROUTES.WORKSPACE_TIME_ENTRY as (id: string) => string)('workspace-1')).toBe(
        '/tracker/workspace-1/time-entry',
      );
      expect((ROUTES.WORKSPACE_REPORTS as (id: string) => string)('workspace-1')).toBe(
        '/tracker/workspace-1/reports',
      );
      expect((ROUTES.WORKSPACE_PROJECTS as (id: string) => string)('workspace-1')).toBe(
        '/tracker/workspace-1/projects',
      );
    });

    it('maintains API compatibility with original ROUTES', () => {
      // Проверяем, что все ожидаемые ключи присутствуют
      const expectedKeys = [
        'HOME',
        'LOGIN',
        'ABOUT',
        'TODOS',
        'TRACKER',
        'WORKSPACE',
        'WORKSPACE_SELECT',
        'WORKSPACE_MANAGE',
        'PROFILE',
        'SETTINGS',
        'TODO_DETAIL',
        'TODO_EDIT',
        'WORKSPACE_DASHBOARD',
        'WORKSPACE_TIME_ENTRY',
        'WORKSPACE_REPORTS',
        'WORKSPACE_PROJECTS',
      ];

      expectedKeys.forEach((key) => {
        expect(ROUTES).toHaveProperty(key);
      });
    });
  });

  describe('paths generator', () => {
    it('generates static paths from config', () => {
      expect(paths).toHaveProperty('home', '/');
      expect(paths).toHaveProperty('login', '/login');
      expect(paths).toHaveProperty('about', '/about');
      expect(paths).toHaveProperty('todos', '/todos');
      expect(paths).toHaveProperty('profile', '/profile');
      expect(paths).toHaveProperty('settings', '/settings');
    });

    it('has correct path types', () => {
      Object.values(paths).forEach((path) => {
        expect(typeof path).toBe('string');
        expect(path).toMatch(/^\/[a-z-]*$/);
      });
    });
  });

  describe('dynamicPaths generator', () => {
    it('generates dynamic path functions', () => {
      expect(typeof dynamicPaths.todoDetail).toBe('function');
      expect(typeof dynamicPaths.todoEdit).toBe('function');
    });

    it('creates correct dynamic paths', () => {
      expect(dynamicPaths.todoDetail('123')).toBe('/todos/123');
      expect(dynamicPaths.todoEdit('456')).toBe('/todos/456/edit');
    });

    it('handles different parameter types', () => {
      expect(dynamicPaths.todoDetail('789')).toBe('/todos/789');
      expect(dynamicPaths.todoEdit('abc')).toBe('/todos/abc/edit');
    });
  });

  describe('routes generator', () => {
    it('combines static and dynamic paths', () => {
      expect(routes).toHaveProperty('home');
      expect(routes).toHaveProperty('todoDetail');
      expect(routes.home).toBe('/');
      expect(typeof routes.todoDetail).toBe('function');
    });

    it('has all static paths', () => {
      (Object.keys(paths) as Array<keyof typeof paths>).forEach((key) => {
        expect(routes).toHaveProperty(key);
        expect(routes[key]).toBe(paths[key]);
      });
    });

    it('has all dynamic paths', () => {
      (Object.keys(dynamicPaths) as Array<keyof typeof dynamicPaths>).forEach((key) => {
        expect(routes).toHaveProperty(key);
        expect(routes[key]).toBe(dynamicPaths[key]);
      });
    });
  });

  describe('navigationConfig generator', () => {
    it('generates navigation from config', () => {
      expect(navigationConfig).toHaveProperty('login');
      expect(navigationConfig).toHaveProperty('about');
      expect(navigationConfig).toHaveProperty('todos');
      expect(navigationConfig).toHaveProperty('profile');
      expect(navigationConfig).toHaveProperty('settings');
    });

    it('has correct navigation structure', () => {
      Object.values(navigationConfig).forEach((nav: unknown) => {
        const navItem = nav as { label: string; href: string; order?: number };
        expect(navItem).toHaveProperty('label');
        expect(navItem).toHaveProperty('href');
        expect(typeof navItem.label).toBe('string');
        expect(typeof navItem.href).toBe('string');
        // order может быть undefined для скрытых маршрутов
        if (navItem.order !== undefined) {
          expect(typeof navItem.order).toBe('number');
        }
      });
    });

    it('handles hideWhenAuthenticated property', () => {
      expect(navigationConfig.login.hideWhenAuthenticated).toBe(true);
      expect(navigationConfig.about.hideWhenAuthenticated).toBeUndefined();
    });
  });

  describe('mainNavigation generator', () => {
    it('sorts navigation by order', () => {
      const orders = mainNavigation.map((item: { order?: number }) => item.order ?? 999);

      // Теперь все маршруты сортируются вместе, включая stateful
      // Ожидаемый порядок: [1, 2, 3, 5, 6] (Todos, Workspaces, Settings, Profile, About)
      expect(orders).toEqual([1, 2, 3, 5, 6]);
      const sortedOrders = [...orders].sort((a, b) => a - b);
      expect(orders).toEqual(sortedOrders);
    });

    it('filters out hidden routes', () => {
      const hasHiddenRoutes = mainNavigation.some(
        (item: { hideWhenAuthenticated?: boolean }) => item.hideWhenAuthenticated,
      );
      expect(hasHiddenRoutes).toBe(false);
    });

    it('includes all visible navigation items', () => {
      const visibleStaticItems = Object.values(navigationConfig).filter(
        (item: unknown) => !(item as { hideWhenAuthenticated?: boolean }).hideWhenAuthenticated,
      );
      expect(mainNavigation.length).toBeGreaterThanOrEqual(visibleStaticItems.length);
    });

    it('has correct navigation structure', () => {
      mainNavigation.forEach((item: { label: string; href: string }) => {
        expect(item).toHaveProperty('label');
        expect(item).toHaveProperty('href');
        expect(typeof item.href).toBe('string');
      });
    });
  });

  describe('metadataConfig generator', () => {
    it('provides metadata for known routes', () => {
      const routes = Object.keys(metadataConfig);
      expect(routes.length).toBeGreaterThan(0);

      // Проверяем что у каждого маршрута есть метаданные
      routes.forEach((path) => {
        const metadata = metadataConfig[path];
        expect(metadata).toBeDefined();
        expect(typeof metadata).toBe('object');
      });
    });

    it('returns undefined for unknown route', () => {
      expect(metadataConfig['/__unknown__' as keyof typeof metadataConfig]).toBeUndefined();
    });

    it('metadataConfig structure is consistent', () => {
      const routes = Object.keys(metadataConfig);
      expect(routes.length).toBeGreaterThan(0);

      const firstPath = routes[0];
      if (firstPath) {
        const metadata = metadataConfig[firstPath];

        // Проверяем базовую структуру метаданных
        expect(metadata).toHaveProperty('title');
        expect(metadata).toHaveProperty('description');
      }
    });
  });

  describe('headerTemplates generator', () => {
    it('generates header templates', () => {
      expect(headerTemplates).toHaveProperty('home');
      expect(headerTemplates).toHaveProperty('login');
      expect(headerTemplates).toHaveProperty('about');
      expect(headerTemplates).toHaveProperty('todos');
      expect(headerTemplates).toHaveProperty('profile');
      expect(headerTemplates).toHaveProperty('settings');
    });

    it('has correct header template structure', () => {
      Object.values(headerTemplates).forEach((template: unknown) => {
        const tmpl = template as {
          type: string;
          descriptor?: unknown;
          fallback?: unknown;
          build?: unknown;
        };
        expect(tmpl).toHaveProperty('type');
        expect(['static', 'entity']).toContain(tmpl.type);

        if (tmpl.type === 'static') {
          expect(tmpl).toHaveProperty('descriptor');
        } else if (tmpl.type === 'entity') {
          expect(tmpl).toHaveProperty('fallback');
          expect(tmpl).toHaveProperty('build');
        }
      });
    });
  });

  describe('path guards generators', () => {
    it('generates public paths set', () => {
      expect(publicPaths).toBeInstanceOf(Set);
      expect(publicPaths.has('/')).toBe(true);
      expect(publicPaths.has('/login')).toBe(true);
      expect(publicPaths.has('/about')).toBe(true);
      expect(publicPaths.has('/todos')).toBe(false);
    });

    it('generates protected paths set', () => {
      expect(protectedPaths).toBeInstanceOf(Set);
      expect(protectedPaths.has('/todos')).toBe(true);
      expect(protectedPaths.has('/profile')).toBe(true);
      expect(protectedPaths.has('/settings')).toBe(true);
      expect(protectedPaths.has('/login')).toBe(false);
    });

    it('generates protected patterns', () => {
      expect(protectedPatterns).toBeInstanceOf(Array);
      expect(protectedPatternsArray).toBeInstanceOf(Array);
      // protectedPatternsArray содержит RegExp, а protectedPatterns - строки
      expect(protectedPatternsArray.length).toBe(protectedPatterns.length);

      // Проверяем что protectedPatternsArray содержит RegExp
      protectedPatternsArray.forEach((pattern: RegExp) => {
        expect(pattern).toBeInstanceOf(RegExp);
      });

      // Проверяем что protectedPatterns содержит строки
      protectedPatterns.forEach((pattern: string) => {
        expect(typeof pattern).toBe('string');
      });
    });
  });

  describe('guard functions', () => {
    it('isPublicPath works correctly', () => {
      expect(isPublicPath('/')).toBe(true);
      expect(isPublicPath('/login')).toBe(true);
      expect(isPublicPath('/about')).toBe(true);
      expect(isPublicPath('/todos')).toBe(false);
      expect(isPublicPath('/profile')).toBe(false);
    });

    it('isProtectedPath works correctly', () => {
      expect(isProtectedPath('/todos')).toBe(true);
      expect(isProtectedPath('/profile')).toBe(true);
      expect(isProtectedPath('/settings')).toBe(true);
      expect(isProtectedPath('/login')).toBe(false);
      expect(isProtectedPath('/about')).toBe(false);
    });

    it('requiresAuth works correctly', () => {
      expect(requiresAuth('/todos')).toBe(true);
      expect(requiresAuth('/profile')).toBe(true);
      expect(requiresAuth('/settings')).toBe(true);
      expect(requiresAuth('/login')).toBe(false);
      expect(requiresAuth('/about')).toBe(false);
    });

    it('dynamic routes are protected', () => {
      expect(isProtectedPath('/todos/123')).toBe(true);
      expect(isProtectedPath('/todos/456/edit')).toBe(true);
      expect(isPublicPath('/todos/123')).toBe(false);
    });
  });
});
