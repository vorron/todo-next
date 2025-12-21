'use client';

import { useTodosFiltersUrlSync } from './use-todos-filters-url-sync';

export function useTodosFiltersViewModel() {
  return useTodosFiltersUrlSync();
}
