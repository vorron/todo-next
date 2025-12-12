'use client';

import { useEffect } from 'react';
import { CreateTodoForm } from '@/features/todo/todo-create';
import { TodoList } from '@/features/todo/ui/todo-list';
import { TodoSelectionProvider } from '@/features/todo/todo-bulk-actions';
import { TodosFiltersProvider, useTodosFilters } from '../model/todos-filters-context';
import { TodosFiltersBar } from './todos-filters-bar';
import { useDebounce } from '@/shared/lib/hooks';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function TodosPage() {
  return (
    <TodosFiltersProvider>
      <TodoSelectionProvider>
        <TodosPageContent />
      </TodoSelectionProvider>
    </TodosFiltersProvider>
  );
}

function TodosPageContent() {
  const { filter, search, sortBy, setFilter, setSearch, setSortBy } = useTodosFilters();
  const debouncedSearch = useDebounce(search, 300);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    const urlFilter = (searchParams.get('filter') ?? 'all') as typeof filter;
    const urlSort = (searchParams.get('sort') ?? 'date') as typeof sortBy;

    setSearch(q);
    if (urlFilter === 'all' || urlFilter === 'active' || urlFilter === 'completed') {
      setFilter(urlFilter);
    }
    if (urlSort === 'date' || urlSort === 'priority' || urlSort === 'alphabetical') {
      setSortBy(urlSort);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const q = debouncedSearch.trim();

    const f = filter;
    const s = sortBy;

    if (q) {
      params.set('q', q);
    } else {
      params.delete('q');
    }

    if (f && f !== 'all') {
      params.set('filter', f);
    } else {
      params.delete('filter');
    }

    if (s && s !== 'date') {
      params.set('sort', s);
    } else {
      params.delete('sort');
    }

    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname);
    }
  }, [debouncedSearch, filter, pathname, router, searchParams, sortBy]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Todos</h1>
        <p className="text-gray-600">Manage your tasks efficiently</p>
      </div>

      <TodosFiltersBar />

      <CreateTodoForm />

      <TodoList filter={filter} search={debouncedSearch} sortBy={sortBy} />
    </div>
  );
}
