/**
 * Stateful Route Generators - генераторы для устранения дублирования конфигурации
 * Автоматически создает конфигурацию состояний из router-config
 */

import type { StatefulRouteConfig } from './config-types';

/**
 * Типы для сгенерированной конфигурации состояний
 */
export type GeneratedStateConfig<_T extends string> = {
  component: React.ComponentType;
  title?: string;
  description?: string;
};

export type GeneratedStateConfigs<T extends string> = Record<T, GeneratedStateConfig<T>>;

/**
 * Discriminated union для строгой типизации состояний
 */
export type StateData<T extends Record<string, unknown>, K extends keyof T> = {
  state: K;
  data: T[K];
};

/**
 * Создает конфигурацию состояний из StatefulRouteConfig
 * Устраняет дублирование между router-config и feature конфигурацией
 */
export function generateStateConfig<T extends Record<string, unknown>, K extends string>(
  config: StatefulRouteConfig<T>,
  componentMap: Record<string, React.ComponentType>,
): GeneratedStateConfigs<K> {
  const result = {} as GeneratedStateConfigs<K>;

  for (const [stateKey, stateConfig] of Object.entries(config.states)) {
    const metadata = stateConfig.metadata?.();

    result[stateKey as K] = {
      component: componentMap[stateKey] || (() => null), // Fallback компонент
      title: typeof metadata?.title === 'string' ? metadata.title : undefined,
      description: metadata?.description || undefined,
    };
  }

  return result;
}

/**
 * Создает строготипизированные утилиты для состояний
 */
export function createStatefulUtilsTyped<T extends Record<string, unknown>, K extends string>(
  config: StatefulRouteConfig<T>,
  options?: {
    stateRules?: {
      loading?: K;
      empty?: K;
      single?: K;
      multiple?: K;
    };
    dataRules?: Partial<Record<K, (currentItem: unknown) => T[K]>>;
  },
) {
  const {
    loading = 'loading' as K,
    empty = 'empty' as K,
    single = 'single' as K,
    multiple = 'multiple' as K,
  } = options?.stateRules || {};

  return {
    /**
     * Определяет состояние на основе данных
     */
    getStateKey: (data: { isLoading?: boolean; items?: unknown[]; currentItem?: unknown }): K => {
      if (data.isLoading) return loading;

      const items = data.items || [];
      if (items.length === 0) return empty;
      if (items.length === 1) return single;

      return multiple;
    },

    /**
     * Получает title для состояния
     */
    getStateTitle: (stateKey: K, currentItem: unknown): string => {
      const stateConfig = config.states[stateKey as keyof typeof config.states];

      if (!stateConfig) {
        return (config.metadata?.title || 'Unknown') as string;
      }

      if (currentItem && typeof currentItem === 'object' && 'name' in currentItem) {
        return (currentItem as { name: string }).name;
      }

      const metadata = stateConfig.metadata?.();
      return (metadata?.title || config.metadata?.title || 'Unknown') as string;
    },

    /**
     * Получает breadcrumbs для состояния
     */
    getStateBreadcrumbs: (
      stateKey: K,
      currentItem: unknown,
    ): Array<{ href: string; label: string }> => {
      const stateConfig = config.states[stateKey as keyof typeof config.states];

      if (!stateConfig?.header) {
        return [{ href: config.path, label: (config.metadata?.title || 'Unknown') as string }];
      }

      if (currentItem && typeof currentItem === 'object' && stateConfig.header.type === 'entity') {
        const entityData = {
          id: (currentItem as { id: string }).id,
          name: (currentItem as { name: string }).name,
          ...currentItem,
        };

        const breadcrumbs = stateConfig.header.build?.(entityData)?.breadcrumbs;
        if (breadcrumbs) {
          return breadcrumbs.map((b) => ({ href: b.href, label: b.label as string }));
        }
      }

      const descriptorBreadcrumbs = stateConfig.header.descriptor?.breadcrumbs;
      if (descriptorBreadcrumbs) {
        return descriptorBreadcrumbs.map((b) => ({ href: b.href, label: b.label as string }));
      }

      return [{ href: config.path, label: (config.metadata?.title || 'Unknown') as string }];
    },

    /**
     * Получает данные для состояния с строгой типизацией
     */
    getStateData: (stateKey: K, currentItem: unknown): T[K] => {
      const rule = options?.dataRules?.[stateKey];
      if (rule && currentItem) {
        return rule(currentItem) as T[K];
      }

      if (currentItem && typeof currentItem === 'object' && 'id' in currentItem) {
        return {
          entityId: (currentItem as { id: string }).id,
          ...currentItem,
        } as unknown as T[K];
      }

      return {} as T[K];
    },

    /**
     * Создает discriminated union для состояния
     */
    createStateData: <K2 extends K>(state: K2, data: T[K2]): StateData<T, K2> => ({
      state,
      data,
    }),

    /**
     * Валидирует состояние
     */
    isValidState: (state: unknown): state is K => {
      return typeof state === 'string' && state in config.states;
    },

    /**
     * Получает fallback состояние
     */
    getFallbackState: (): K => {
      return (config.fallbackState || config.defaultState) as K;
    },
  };
}

/**
 * Создает навигационные утилиты для stateful роутинга
 */
export function createStatefulNavigation<T extends Record<string, unknown>, K extends string>(
  config: StatefulRouteConfig<T>,
  currentState: K,
  navigateCallback: (state: K, data?: T[K]) => void,
) {
  return {
    currentState: currentState as string,
    availableStates: Object.keys(config.states) as K[],

    /**
     * Навигация с строгой типизацией
     */
    navigateTo: <K2 extends K>(state: K2, data?: T[K2]) => {
      navigateCallback(state, data);
    },

    /**
     * Удобные методы для конкретных состояний
     */
    navigateToLoading: () => navigateCallback('loading' as K),
    navigateToCreate: () => navigateCallback('create' as K),
    navigateToSelect: () => navigateCallback('select' as K),
    navigateToDashboard: (data: T[K]) => navigateCallback('dashboard' as K, data),

    syncWithUrl: config.syncWithUrl ?? false,
  };
}

/**
 * Типы для URL синхронизации
 */
export type UrlSyncOptions = {
  enabled: boolean;
  syncOnLoad?: boolean;
  syncOnChange?: boolean;
  basePath?: string;
};

/**
 * Создает утилиты для URL синхронизации
 */
export function createUrlSyncUtils<T extends Record<string, unknown>, K extends string>(
  config: StatefulRouteConfig<T>,
  options: UrlSyncOptions = { enabled: false },
) {
  if (!options.enabled) {
    return {
      isUrlSyncEnabled: false,
      getStateFromUrl: () => null,
      getUrlForState: () => config.path,
      syncStateWithUrl: () => {},
    };
  }

  return {
    isUrlSyncEnabled: true,

    /**
     * Извлекает состояние из URL
     */
    getStateFromUrl: (url: string): { state: K; data?: T[K] } | null => {
      // Ищем состояние по urlPattern
      for (const [stateKey, stateConfig] of Object.entries(config.states)) {
        if (stateConfig.urlPattern) {
          const pattern = stateConfig.urlPattern;
          const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '([^/]+)')}$`);

          if (regex.test(url)) {
            const params = extractUrlParams(pattern, url);
            return {
              state: stateKey as K,
              data: params as T[K],
            };
          }
        }
      }

      return null;
    },

    /**
     * Создает URL для состояния
     */
    getUrlForState: (state: K, data?: T[K]): string => {
      const stateConfig = config.states[state as keyof typeof config.states];

      if (stateConfig?.urlPattern) {
        const pattern = stateConfig.urlPattern;

        if (data && pattern.includes(':')) {
          return buildUrlFromPattern(pattern, data as Record<string, string>);
        }

        return pattern;
      }

      return config.path;
    },

    /**
     * Синхронизирует состояние с URL
     */
    syncStateWithUrl: (state: K, data?: T[K]) => {
      if (typeof window !== 'undefined' && options.enabled) {
        const urlSyncUtils = createUrlSyncUtils(config, options);
        const url = urlSyncUtils.getUrlForState(state, data);
        window.history.pushState({}, '', url);
      }
    },
  };
}

// Вспомогательные функции для URL работы
function extractUrlParams(pattern: string, url: string): Record<string, string> {
  const patternParts = pattern.split('/');
  const urlParts = url.split('/');
  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const urlPart = urlParts[i];

    if (patternPart && patternPart.startsWith(':') && urlPart) {
      const paramName = patternPart.slice(1);
      params[paramName] = urlPart;
    }
  }

  return params;
}

function buildUrlFromPattern(pattern: string, params: Record<string, string>): string {
  return pattern.replace(/:([^/]+)/g, (_, param) => params[param] || `:${param}`);
}
