'use client';

import { Button } from '@/shared/ui';
import { FILTER_OPTIONS } from '@/entities/todo';
import { useTodosFilters } from '../model/todos-filters-context';
import { TodoSearchInput } from '@/features/todo/todo-search';
import { TodoSortSelect } from '@/features/todo/todo-sort';

type FilterValue = (typeof FILTER_OPTIONS)[number]['value'];

export function TodosFiltersBar() {
  const { filter, search, sortBy, setFilter, setSearch, setSortBy } = useTodosFilters();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_OPTIONS.map((option) => {
          const isActive = option.value === filter;

          return (
            <Button
              key={option.value}
              variant={isActive ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(option.value as FilterValue)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <TodoSearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} />
        <TodoSortSelect value={sortBy} onChange={setSortBy} />
      </div>
    </div>
  );
}
