/**
 * Entity Router Utils - общие утилиты для entity-specific роутинга
 * Переиспользуемые функции для любых entity (workspace, project, etc.)
 */

import type { RouteState, StatefulNavigation, EntityState } from './config-types';

/**
 * Создает начальное состояние для любой entity
 */
export function createInitialEntityState<T extends Record<string, unknown>>(
  defaultState: string,
): RouteState<T> {
  return {
    key: defaultState as keyof T,
  } as RouteState<T>;
}

/**
 * Создает типизированное состояние для entity
 */
export function createEntityState<T extends Record<string, unknown>, K extends keyof T>(
  stateKey: K,
  data: T[K],
): EntityState<T> {
  return {
    key: stateKey,
    data,
  } as EntityState<T>;
}

/**
 * Создает навигацию для любой entity
 */
export function createEntityNavigation<T extends Record<string, unknown>>(
  currentState: string,
  availableStates: string[],
  navigateCallback: (state: string, data?: T[keyof T]) => void,
): StatefulNavigation<T[keyof T]> {
  return {
    currentState,
    availableStates,
    navigateTo: (state: string, data?: T[keyof T]) => {
      navigateCallback(state, data);
    },
    syncWithUrl: true,
  };
}

/**
 * Проверяет является ли состояние состоянием для конкретной entity
 */
export function isEntityState<T extends Record<string, unknown>>(
  state: RouteState,
  validStates: string[],
): state is RouteState<T> {
  return validStates.includes(state.key);
}
