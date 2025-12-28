'use client';

import { startTransition, useEffect, useRef } from 'react';

import { FILTER_VALUES, SORT_VALUES } from '@/entities/todo';
import { type TodosViewState } from '@/entities/todo/model/types';
import { type Schema, useSchemaQueryParams } from '@/shared/hooks/use-query-params';

import { useTodosView } from './todos-view-context';

const schema = [
  {
    name: 'filter',
    values: FILTER_VALUES,
    defaultValue: 'all',
  },
  {
    name: 'search',
    defaultValue: '',
    trim: true,
  },
  {
    name: 'sortBy',
    values: SORT_VALUES,
    defaultValue: 'date',
  },
] as const satisfies Schema;

type TodosViewComparableState = Pick<TodosViewState, 'filter' | 'search' | 'sortBy'>;

function areTodosViewStatesEqual(a: TodosViewComparableState, b: TodosViewComparableState) {
  return a.filter === b.filter && a.search === b.search && a.sortBy === b.sortBy;
}

/**
 * Keeps todos view state in sync with URL query params.
 * Expects a debounced search value to avoid pushing URL on every keystroke.
 */
export function useTodosViewUrlSync(syncedSearch: string) {
  const { filter, search, sortBy, setFilter, setSearch, setSortBy } = useTodosView();
  const { state: urlState, buildQuery } = useSchemaQueryParams(schema);

  const isInitialLoad = useRef(true);
  const isUpdatingFromUrl = useRef(false);
  const lastSyncedState = useRef(urlState);

  // Effect 1: Sync URL state to local state when URL changes
  useEffect(() => {
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    const hasUrlChanged = !areTodosViewStatesEqual(urlState, lastSyncedState.current);
    if (!hasUrlChanged) return;

    if (urlState.search !== search) setSearch(urlState.search);
    if (urlState.filter !== filter) setFilter(urlState.filter);
    if (urlState.sortBy !== sortBy) setSortBy(urlState.sortBy);

    lastSyncedState.current = urlState;
  }, [urlState, filter, search, sortBy, setFilter, setSearch, setSortBy]);

  // Effect 2: Sync local state to URL when debounced and ready
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (syncedSearch !== search) return;

    const localState = { filter, search, sortBy };
    if (areTodosViewStatesEqual(localState, lastSyncedState.current)) return;

    isUpdatingFromUrl.current = true;
    lastSyncedState.current = localState;

    startTransition(() => {
      buildQuery(localState);
    });
  }, [syncedSearch, filter, search, sortBy, buildQuery]);
}
