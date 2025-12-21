'use client';

import { FILTER_VALUES, SORT_VALUES, type FilterType, type TodoSortBy } from '@/entities/todo';

export const QUERY_KEYS = {
  search: 'q',
  filter: 'filter',
  sort: 'sort',
} as const;

export interface TodosQueryState {
  search: string;
  filter: FilterType;
  sortBy: TodoSortBy;
}

export const DEFAULT_TODOS_QUERY_STATE: TodosQueryState = {
  search: '',
  filter: 'all',
  sortBy: 'date',
};

function normalizeFilter(value: string | null): FilterType {
  return FILTER_VALUES.includes(value as (typeof FILTER_VALUES)[number])
    ? (value as FilterType)
    : DEFAULT_TODOS_QUERY_STATE.filter;
}

function normalizeSort(value: string | null): TodoSortBy {
  return SORT_VALUES.includes(value as (typeof SORT_VALUES)[number])
    ? (value as TodoSortBy)
    : DEFAULT_TODOS_QUERY_STATE.sortBy;
}

export function parseTodosQuery(searchParamsString: string): TodosQueryState {
  const params = new URLSearchParams(searchParamsString);

  return {
    search: params.get(QUERY_KEYS.search) ?? DEFAULT_TODOS_QUERY_STATE.search,
    filter: normalizeFilter(params.get(QUERY_KEYS.filter)),
    sortBy: normalizeSort(params.get(QUERY_KEYS.sort)),
  };
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

export function buildTodosQuery(state: TodosQueryState): string {
  const params = new URLSearchParams();

  const nextSearch = state.search.trim();
  setOrDelete(params, QUERY_KEYS.search, nextSearch);
  setOrDelete(
    params,
    QUERY_KEYS.filter,
    state.filter !== DEFAULT_TODOS_QUERY_STATE.filter ? state.filter : '',
  );
  setOrDelete(
    params,
    QUERY_KEYS.sort,
    state.sortBy !== DEFAULT_TODOS_QUERY_STATE.sortBy ? state.sortBy : '',
  );

  return params.toString();
}
