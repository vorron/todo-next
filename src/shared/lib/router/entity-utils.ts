/**
 * Entity Utilities - утилиты для работы с сущностями в роутинге
 * Упрощенные утилиты без stateful концепции
 */

/**
 * Создает начальное состояние для любой entity
 */
export function createInitialEntityState<T extends Record<string, unknown>>(
  defaultState: string,
): { key: string } {
  return {
    key: defaultState as keyof T,
  } as { key: string };
}

/**
 * Создает навигацию для entity
 */
export function createEntityNavigation<T extends Record<string, unknown>>(
  currentState: string,
  availableStates: string[],
  navigateCallback: (state: string, data?: T[keyof T]) => void,
): {
  currentState: string;
  availableStates: string[];
  navigateTo: (state: string, data?: T[keyof T]) => void;
} {
  return {
    currentState,
    availableStates,
    navigateTo: (state: string, data?: T[keyof T]) => {
      navigateCallback(state, data);
    },
  };
}
