/**
 * Тесты для stateful генераторов роутинга
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  generateStateConfig,
  createStatefulUtilsTyped,
  createUrlSyncUtils,
  createStatefulNavigation,
} from './stateful-generators';

import type { StatefulRouteConfig } from './config-types';

// Mock конфигурация для тестов
const mockStatefulConfig: StatefulRouteConfig<{
  loading: Record<string, never>;
  create: Record<string, never>;
  dashboard: { workspaceId: string };
}> = {
  path: '/workspace',
  protected: true,
  metadata: {
    title: 'Workspace',
    description: 'Manage your workspaces',
  },
  states: {
    loading: {
      key: 'loading',
      metadata: () => ({ title: 'Loading...' }),
    },
    create: {
      key: 'create',
      metadata: () => ({ title: 'Create Workspace' }),
    },
    dashboard: {
      key: 'dashboard',
      urlPattern: '/workspace/:id',
      metadata: () => ({ title: 'Workspace Dashboard' }),
    },
  },
  defaultState: 'loading',
  syncWithUrl: false,
  fallbackState: 'loading',
};

// Mock компоненты
const mockComponents = {
  loading: () => null,
  create: () => null,
  dashboard: () => null,
};

describe('generateStateConfig', () => {
  it('должен генерировать конфигурацию состояний из router-config', () => {
    const result = generateStateConfig(mockStatefulConfig, mockComponents);

    expect(result).toEqual({
      loading: {
        component: mockComponents.loading,
        title: 'Loading...',
        description: undefined,
      },
      create: {
        component: mockComponents.create,
        title: 'Create Workspace',
        description: undefined,
      },
      dashboard: {
        component: mockComponents.dashboard,
        title: 'Workspace Dashboard',
        description: undefined,
      },
    });
  });

  it('должен использовать fallback компонент если компонент не найден', () => {
    const incompleteComponents = {
      loading: mockComponents.loading,
      // create отсутствует
      dashboard: mockComponents.dashboard,
    };

    const result = generateStateConfig(mockStatefulConfig, incompleteComponents);

    expect(result.create?.component).toBeInstanceOf(Function);
  });
});

describe('createStatefulUtilsTyped', () => {
  let utils: ReturnType<typeof createStatefulUtilsTyped>;

  beforeEach(() => {
    utils = createStatefulUtilsTyped(mockStatefulConfig, {
      stateRules: {
        loading: 'loading',
        empty: 'create',
        single: 'dashboard',
        multiple: 'select',
      },
      dataRules: {
        dashboard: (currentItem: unknown) => {
          return {
            workspaceId: (currentItem as { id: string }).id,
          };
        },
      },
    });
  });

  describe('getStateKey', () => {
    it('должен возвращать loading при isLoading', () => {
      const result = utils.getStateKey({ isLoading: true });
      expect(result).toBe('loading');
    });

    it('должен возвращать create при пустых данных', () => {
      const result = utils.getStateKey({ isLoading: false, items: [] });
      expect(result).toBe('create');
    });

    it('должен возвращать dashboard при одном элементе', () => {
      const result = utils.getStateKey({
        isLoading: false,
        items: [{ id: '1' }],
      });
      expect(result).toBe('dashboard');
    });

    it('должен возвращать select при множестве элементов', () => {
      const result = utils.getStateKey({
        isLoading: false,
        items: [{ id: '1' }, { id: '2' }],
      });
      expect(result).toBe('select');
    });
  });

  describe('getStateTitle', () => {
    it('должен возвращать title из имени currentItem', () => {
      const currentItem = { name: 'Test Workspace' };
      const result = utils.getStateTitle('dashboard', currentItem);
      expect(result).toBe('Test Workspace');
    });

    it('должен возвращать title из метаданных состояния', () => {
      const result = utils.getStateTitle('loading', null);
      expect(result).toBe('Loading...');
    });

    it('должен возвращать fallback title', () => {
      const result = utils.getStateTitle('unknown' as keyof typeof mockStatefulConfig.states, null);
      expect(result).toBe('Workspace');
    });
  });

  describe('getStateData', () => {
    it('должен применять dataRules для состояния', () => {
      const currentItem = { id: 'workspace-123' };
      const result = utils.getStateData('dashboard', currentItem);

      expect(result).toEqual({ workspaceId: 'workspace-123' });
    });

    it('должен возвращать entityId для объектов с id', () => {
      const currentItem = { id: 'test-id', name: 'Test' };
      const result = utils.getStateData('create', currentItem);

      expect(result).toEqual({ entityId: 'test-id', id: 'test-id', name: 'Test' });
    });

    it('должен возвращать пустой объект для null', () => {
      const result = utils.getStateData('loading', null);
      expect(result).toEqual({});
    });
  });

  describe('createStateData', () => {
    it('должен создавать discriminated union', () => {
      const stateData = utils.createStateData('dashboard', { workspaceId: '123' });

      expect(stateData.state).toBe('dashboard');
      expect(stateData.data).toEqual({ workspaceId: '123' });

      // TypeScript должен обеспечивать строгую типизацию здесь
      expect(() => {
        // @ts-expect-error - должно быть ошибкой
        stateData.state = 'invalid-state';
      }).toThrow();
    });
  });

  describe('isValidState', () => {
    it('должен валидировать состояния', () => {
      expect(utils.isValidState('loading')).toBe(true);
      expect(utils.isValidState('create')).toBe(true);
      expect(utils.isValidState('dashboard')).toBe(true);
      expect(utils.isValidState('invalid')).toBe(false);
      expect(utils.isValidState(123)).toBe(false);
    });
  });

  describe('getFallbackState', () => {
    it('должен возвращать fallback состояние', () => {
      const result = utils.getFallbackState();
      expect(result).toBe('loading');
    });
  });
});

describe('createUrlSyncUtils', () => {
  describe('с отключенной синхронизацией', () => {
    const urlSyncUtils = createUrlSyncUtils(mockStatefulConfig, { enabled: false });

    it('должен возвращать false для isUrlSyncEnabled', () => {
      expect(urlSyncUtils.isUrlSyncEnabled).toBe(false);
    });

    it('должен возвращать null для getStateFromUrl', () => {
      const result = urlSyncUtils.getStateFromUrl('/workspace/123');
      expect(result).toBeNull();
    });

    it('должен возвращать базовый путь для getUrlForState', () => {
      const result = urlSyncUtils.getUrlForState('dashboard', { workspaceId: '123' });
      expect(result).toBe('/workspace');
    });

    it('не должен вызывать syncStateWithUrl', () => {
      const consoleSpy = vi.spyOn(console, 'warn');
      urlSyncUtils.syncStateWithUrl('dashboard', { workspaceId: '123' });
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('с включенной синхронизацией', () => {
    const urlSyncUtils = createUrlSyncUtils(mockStatefulConfig, { enabled: true });

    it('должен возвращать true для isUrlSyncEnabled', () => {
      expect(urlSyncUtils.isUrlSyncEnabled).toBe(true);
    });

    it('должен извлекать состояние из URL', () => {
      const result = urlSyncUtils.getStateFromUrl('/workspace/123');

      expect(result).toEqual({
        state: 'dashboard',
        data: { id: '123' },
      });
    });

    it('должен создавать URL для состояния', () => {
      const result = urlSyncUtils.getUrlForState('dashboard', { workspaceId: '123' });
      expect(result).toBe('/workspace/123');
    });

    it('должен возвращать базовый путь для состояний без urlPattern', () => {
      const result = urlSyncUtils.getUrlForState('loading', {});
      expect(result).toBe('/workspace');
    });
  });
});

describe('createStatefulNavigation', () => {
  let mockNavigateCallback: (state: string, data?: unknown) => void;
  let navigation: {
    currentState: string;
    availableStates: string[];
    navigateTo: (state: string, data?: unknown) => void;
    navigateToLoading: () => void;
    navigateToCreate: () => void;
    navigateToSelect: () => void;
    navigateToDashboard: (data: unknown) => void;
    syncWithUrl: boolean;
  };

  beforeEach(() => {
    mockNavigateCallback = vi.fn();
    navigation = createStatefulNavigation(
      mockStatefulConfig,
      'loading',
      mockNavigateCallback,
    ) as unknown as {
      currentState: string;
      availableStates: string[];
      navigateTo: (state: string, data?: unknown) => void;
      navigateToLoading: () => void;
      navigateToCreate: () => void;
      navigateToSelect: () => void;
      navigateToDashboard: (data: unknown) => void;
      syncWithUrl: boolean;
    };
  });

  it('должен создавать навигацию с правильными свойствами', () => {
    expect(navigation.currentState).toBe('loading');
    expect(navigation.availableStates).toEqual(['loading', 'create', 'dashboard']);
    expect(navigation.syncWithUrl).toBe(false);
  });

  it('должен вызывать navigateCallback при навигации', () => {
    navigation.navigateTo('create', {});
    expect(mockNavigateCallback).toHaveBeenCalledWith('create', {});
  });

  it('должен предоставлять удобные методы навигации', () => {
    navigation.navigateToCreate();
    expect(mockNavigateCallback).toHaveBeenCalledWith('loading', {}); // create -> loading в rules

    navigation.navigateToDashboard({ workspaceId: '123' } as { workspaceId: string });
    expect(mockNavigateCallback).toHaveBeenCalledWith('dashboard', { workspaceId: '123' });
  });
});

describe('интеграционные тесты', () => {
  it('должен работать полный цикл stateful роутинга', () => {
    // 1. Создаем утилиты
    const utils = createStatefulUtilsTyped(mockStatefulConfig);
    const urlSyncUtils = createUrlSyncUtils(mockStatefulConfig, { enabled: true });

    // 2. Определяем состояние на основе данных
    const currentState = utils.getStateKey({
      isLoading: false,
      items: [{ id: '123', name: 'Test Workspace' }],
    });

    expect(currentState).toBe('dashboard');

    // 3. Получаем данные для состояния
    const stateData = utils.getStateData(currentState, { id: '123' });
    expect(stateData).toEqual({ entityId: '123', id: '123' });

    // 4. Создаем discriminated union
    const typedStateData = utils.createStateData(currentState, stateData);
    expect(typedStateData.state).toBe('dashboard');

    // 5. URL синхронизация
    const url = urlSyncUtils.getUrlForState(
      currentState,
      typedStateData.data as { workspaceId: string },
    );
    expect(url).toBe('/workspace/123');

    // 6. Обратное извлечение из URL
    const extractedState = urlSyncUtils.getStateFromUrl(url);
    expect(extractedState?.state).toBe('dashboard');
  });
});
