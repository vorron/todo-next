'use client';

import { Button } from '@/shared/ui';
import { FILTER_OPTIONS } from '@/entities/todo';
import { useTodosFilters } from '../model/todos-filters-context';

type FilterValue = (typeof FILTER_OPTIONS)[number]['value'];

export function TodosFiltersBar() {
  const { filter, setFilter } = useTodosFilters();

  return (
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
  );
}
