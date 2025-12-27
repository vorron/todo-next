'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { useDebounce } from '@/shared/lib/hooks';

import { useTodosFilters } from './todos-filters-context';
import { buildTodosQuery, parseTodosQuery } from './todos-query-params';

type SyncPhase = 'hydrating' | 'ready';

export function useTodosFiltersUrlSync(debounceMs: number = 300) {
  const { filter, search, sortBy, setFilter, setSearch, setSortBy } = useTodosFilters();
  const debouncedSearch = useDebounce(search, debounceMs);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams]);
  const phaseRef = useRef<SyncPhase>('hydrating');
  const lastSyncedQueryRef = useRef<string>(searchParamsString);

  // Effect (layout) 1: hydrate local state from URL only when the URL actually changed.
  useLayoutEffect(() => {
    if (searchParamsString === lastSyncedQueryRef.current) {
      return;
    }

    const urlState = parseTodosQuery(searchParamsString);

    if (urlState.search !== search) setSearch(urlState.search);
    if (urlState.filter !== filter) setFilter(urlState.filter);
    if (urlState.sortBy !== sortBy) setSortBy(urlState.sortBy);

    phaseRef.current = 'hydrating';
    lastSyncedQueryRef.current = searchParamsString;
  }, [filter, search, searchParamsString, setFilter, setSearch, setSortBy, sortBy]);

  // Effect 2: push local state to URL when ready and debounced value settled.
  useEffect(() => {
    if (phaseRef.current !== 'ready') return;
    if (debouncedSearch !== search) return;

    const nextQuery = buildTodosQuery({ search, filter, sortBy });
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) return;

    lastSyncedQueryRef.current = nextQuery;
    startTransition(() => {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    });
  }, [debouncedSearch, filter, pathname, router, search, searchParams, sortBy]);

  // Mark ready when local state matches the last synced URL.
  useEffect(() => {
    const urlState = parseTodosQuery(lastSyncedQueryRef.current);
    const inSync =
      urlState.search === search && urlState.filter === filter && urlState.sortBy === sortBy;
    phaseRef.current = inSync ? 'ready' : 'hydrating';
  }, [filter, search, sortBy]);

  return {
    filter,
    search,
    sortBy,
    setFilter,
    setSearch,
    setSortBy,
    debouncedSearch,
  };
}
