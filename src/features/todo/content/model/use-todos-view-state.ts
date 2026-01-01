'use client';

import { useCallback, useMemo, useState } from 'react';

import type { FilterType, TodoSortBy } from '@/entities/todo';
import type { TodosViewState } from '@/entities/todo/model/types';

interface TodosViewValue extends TodosViewState {
  setFilter(filter: FilterType): void;
  setSearch(search: string): void;
  setSortBy(sortBy: TodoSortBy): void;
}

export function useTodosViewState(
  initialState: TodosViewState = { filter: 'all', search: '', sortBy: 'date' },
): TodosViewValue {
  const [state, setState] = useState<TodosViewState>(initialState);

  const setFilter = useCallback(
    (filter: FilterType) => setState((prev) => ({ ...prev, filter })),
    [],
  );
  const setSearch = useCallback((search: string) => setState((prev) => ({ ...prev, search })), []);
  const setSortBy = useCallback(
    (sortBy: TodoSortBy) => setState((prev) => ({ ...prev, sortBy })),
    [],
  );

  return useMemo(
    () => ({
      ...state,
      setFilter,
      setSearch,
      setSortBy,
    }),
    [setFilter, setSearch, setSortBy, state],
  );
}
