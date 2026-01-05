/**
 * Stateful Routing Utilities - утилиты для работы с stateful маршрутами
 * Поддерживает client-side навигацию с URL синхронизацией
 */

import type { StatefulRouteConfig, RouteState, StatefulNavigation } from './config-types';

// === URL Utilities ===

/**
 * Извлекает параметры из URL паттерна
 */
export function extractUrlParams(pattern: string, url: string): Record<string, string> {
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

/**
 * Создает URL из паттерна с параметрами
 */
export function buildUrlFromPattern(pattern: string, params: Record<string, string>): string {
  return pattern.replace(/:([^/]+)/g, (_, param) => params[param] || `:${param}`);
}

/**
 * Определяет состояние из URL для stateful маршрута
 */
export function getStateFromUrl<T extends Record<string, unknown> = Record<string, unknown>>(
  config: StatefulRouteConfig<T>,
  currentUrl: string,
): { state: keyof T; data?: T[keyof T] } {
  // Ищем состояние по urlPattern
  for (const stateKey of Object.keys(config.states) as string[]) {
    const stateConfig = config.states[stateKey];

    if (stateConfig && stateConfig.urlPattern) {
      const pattern = stateConfig.urlPattern;
      const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '([^/]+)')}$`);

      if (regex.test(currentUrl)) {
        const params = extractUrlParams(pattern, currentUrl);
        return {
          state: stateKey as keyof T,

          data: params as T[keyof T],
        };
      }
    }
  }

  // Если не найдено, возвращаем default state
  return { state: config.defaultState };
}

/**
 * Создает URL для состояния stateful маршрута
 */
export function getUrlForState<T extends Record<string, unknown> = Record<string, unknown>>(
  config: StatefulRouteConfig<T>,
  state: keyof T,
  data?: T[keyof T],
): string {
  const stateKey = state as string;
  const stateConfig = config.states[stateKey];

  if (stateConfig && stateConfig.urlPattern) {
    const pattern = stateConfig.urlPattern;

    if (data && pattern.includes(':')) {
      return buildUrlFromPattern(pattern, data as Record<string, string>);
    }

    return pattern;
  }

  return config.path;
}

// === State Management Utilities ===

/**
 * Создает начальное состояние для stateful маршрута
 */
export function createInitialState<T extends Record<string, unknown> = Record<string, unknown>>(
  config: StatefulRouteConfig<T>,
  initialUrl?: string,
): RouteState<T[keyof T]> {
  if (initialUrl && config.syncWithUrl) {
    const { state, data } = getStateFromUrl(config, initialUrl);
    return {
      key: state as string,
      data,
    };
  }

  return {
    key: config.defaultState as string,
  };
}

/**
 * Валидирует состояние для stateful маршрута
 */
export function isValidState<T extends Record<string, unknown> = Record<string, unknown>>(
  config: StatefulRouteConfig<T>,
  state: string | number | symbol,
): state is keyof T {
  return typeof state === 'string' && state in config.states;
}

/**
 * Получает fallback состояние
 */
export function getFallbackState<T extends Record<string, unknown> = Record<string, unknown>>(
  config: StatefulRouteConfig<T>,
): keyof T {
  return config.fallbackState || config.defaultState;
}

// === Navigation Utilities ===

/**
 * Создает объект навигации для stateful маршрута
 */
export function createStatefulNavigation<
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  config: StatefulRouteConfig<T>,
  currentState: keyof T,
  navigateCallback: (state: keyof T, data?: T[keyof T]) => void,
): StatefulNavigation<T[keyof T]> {
  return {
    currentState: currentState as string,
    availableStates: Object.keys(config.states),
    navigateTo: (state: string, data?: T[keyof T]) => {
      if (isValidState(config, state)) {
        navigateCallback(state as keyof T, data);
      } else {
        console.warn(`Invalid state: ${state}`);
        navigateCallback(getFallbackState(config));
      }
    },
    syncWithUrl: config.syncWithUrl,
  };
}

// === React Hooks Utilities ===

/**
 * Хук для работы с stateful маршрутом
 */
export function useStatefulRoute<T extends Record<string, unknown> = Record<string, unknown>>(
  _config: StatefulRouteConfig<T>,
  _initialUrl?: string,
) {
  // Эта функция будет использоваться в React компонентах
  // Реализация будет в отдельном файле с React зависимостями
  throw new Error('useStatefulRoute should be imported from @/shared/lib/router/react');
}

// === Type Guards ===

/**
 * Проверяет является ли маршрут stateful
 */
export function isStatefulRouteConfig(
  config: unknown,
): config is StatefulRouteConfig<Record<string, unknown>> {
  return !!(config && typeof config === 'object' && 'states' in config && 'defaultState' in config);
}

// === Debug Utilities ===

/**
 * Логирует состояние stateful маршрута (только в development)
 */
export function debugStatefulRoute<T extends Record<string, unknown> = Record<string, unknown>>(
  _config: StatefulRouteConfig<T>,
  state: RouteState<T[keyof T]>,
  action: string,
) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔄 Stateful Route [${action}]`);
    // console.log('Route:', config.path);
    console.log('State:', state.key);
    console.log('Data:', state.data);
    // console.log('Available states:', Object.keys(config.states));
    console.groupEnd();
  }
}
