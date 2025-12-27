'use client';

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import type { FilterType, TodoSortBy } from '@/entities/todo';

interface TodosFiltersState {
  filter: FilterType;
  search: string;
  sortBy: TodoSortBy;
}

type TodosFiltersAction =
  | { type: 'SET_FILTER'; filter: FilterType }
  | { type: 'SET_SEARCH'; search: string }
  | { type: 'SET_SORT_BY'; sortBy: TodoSortBy }
  | { type: 'RESET' };

const initialState: TodosFiltersState = {
  filter: 'all',
  search: '',
  sortBy: 'date',
};

function todosFiltersReducer(
  state: TodosFiltersState,
  action: TodosFiltersAction,
): TodosFiltersState {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    case 'SET_SEARCH':
      return { ...state, search: action.search };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.sortBy };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface TodosFiltersContextValue extends TodosFiltersState {
  setFilter(filter: FilterType): void;
  setSearch(search: string): void;
  setSortBy(sortBy: TodoSortBy): void;
  reset(): void;
}

const TodosFiltersContext = createContext<TodosFiltersContextValue | null>(null);

export function TodosFiltersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todosFiltersReducer, initialState);

  const value = useMemo<TodosFiltersContextValue>(
    () => ({
      ...state,
      setFilter: (filter: FilterType) => dispatch({ type: 'SET_FILTER', filter }),
      setSearch: (search: string) => dispatch({ type: 'SET_SEARCH', search }),
      setSortBy: (sortBy: TodoSortBy) => dispatch({ type: 'SET_SORT_BY', sortBy }),
      reset: () => dispatch({ type: 'RESET' }),
    }),
    [state],
  );

  return <TodosFiltersContext.Provider value={value}>{children}</TodosFiltersContext.Provider>;
}

export function useTodosFilters(): TodosFiltersContextValue {
  const ctx = useContext(TodosFiltersContext);
  if (!ctx) {
    throw new Error('useTodosFilters must be used within TodosFiltersProvider');
  }
  return ctx;
}
