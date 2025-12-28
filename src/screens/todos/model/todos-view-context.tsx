'use client';

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import { type TodosViewState } from '@/entities/todo/model/types';

import type { FilterType, TodoSortBy } from '@/entities/todo';

const ACTION_TYPES = {
  SET_FILTER: 'SET_FILTER',
  SET_SEARCH: 'SET_SEARCH',
  SET_SORT_BY: 'SET_SORT_BY',
  RESET: 'RESET',
} as const;

type TodosViewAction =
  | { type: typeof ACTION_TYPES.SET_FILTER; filter: FilterType }
  | { type: typeof ACTION_TYPES.SET_SEARCH; search: string }
  | { type: typeof ACTION_TYPES.SET_SORT_BY; sortBy: TodoSortBy }
  | { type: typeof ACTION_TYPES.RESET };

const initialState: TodosViewState = {
  filter: 'all',
  search: '',
  sortBy: 'date',
};

function todosViewReducer(state: TodosViewState, action: TodosViewAction): TodosViewState {
  switch (action.type) {
    case ACTION_TYPES.SET_FILTER: {
      const { filter } = action;
      return { ...state, filter };
    }
    case ACTION_TYPES.SET_SEARCH: {
      const { search } = action;
      return { ...state, search };
    }
    case ACTION_TYPES.SET_SORT_BY: {
      const { sortBy } = action;
      return { ...state, sortBy };
    }
    case ACTION_TYPES.RESET:
      return initialState;
    default:
      return state;
  }
}

interface TodosViewContextValue extends TodosViewState {
  setFilter(filter: FilterType): void;
  setSearch(search: string): void;
  setSortBy(sortBy: TodoSortBy): void;
  reset(): void;
}

const TodosViewContext = createContext<TodosViewContextValue | null>(null);

export function TodosViewProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todosViewReducer, initialState);

  const value = useMemo<TodosViewContextValue>(() => {
    const { filter, search, sortBy } = state;

    return {
      filter,
      search,
      sortBy,
      setFilter: (filter) => dispatch({ type: ACTION_TYPES.SET_FILTER, filter }),
      setSearch: (search) => dispatch({ type: ACTION_TYPES.SET_SEARCH, search }),
      setSortBy: (sortBy) => dispatch({ type: ACTION_TYPES.SET_SORT_BY, sortBy }),
      reset: () => dispatch({ type: ACTION_TYPES.RESET }),
    };
  }, [state]);

  return <TodosViewContext.Provider value={value}>{children}</TodosViewContext.Provider>;
}

export function useTodosView(): TodosViewContextValue {
  const ctx = useContext(TodosViewContext);
  if (!ctx) {
    throw new Error('useTodosView must be used within TodosViewProvider');
  }
  return ctx;
}
