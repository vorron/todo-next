'use client';

import { useEffect, useRef, useState } from 'react';

import { Search, X } from 'lucide-react';

import { useDebounce } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';
import { Input, Button } from '@/shared/ui';

export const SEARCH_DEBOUNCE_MS = 300;

interface TodoSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TodoSearchInput({
  value,
  onChange,
  placeholder = 'Search todos...',
  className,
}: TodoSearchInputProps) {
  const [search, setSearch] = useState(value);
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const prevDebouncedSearch = useRef(debouncedSearch);

  useEffect(() => {
    if (prevDebouncedSearch.current !== debouncedSearch) {
      onChange(debouncedSearch.trim());
      prevDebouncedSearch.current = debouncedSearch;
    }
  }, [debouncedSearch, onChange]);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  const canClear = search.trim().length > 0;
  return (
    <div className={cn('relative w-full sm:w-72', className)}>
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="h-4 w-4" />
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-10"
        aria-label="Search todos"
      />

      {canClear && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Clear search"
            onClick={() => {
              setSearch('');
              onChange('');
            }}
            className="h-8 w-8 px-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
