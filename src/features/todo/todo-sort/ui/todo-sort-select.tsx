'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui';

export type TodoSortOption = {
  value: 'date' | 'priority' | 'alphabetical';
  label: string;
};

const SORT_OPTIONS: TodoSortOption[] = [
  { value: 'date', label: 'Newest' },
  { value: 'priority', label: 'Priority' },
  { value: 'alphabetical', label: 'A–Z' },
];

interface TodoSortSelectProps {
  value: TodoSortOption['value'];
  onChange: (value: TodoSortOption['value']) => void;
}

export function TodoSortSelect({ value, onChange }: TodoSortSelectProps) {
  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0]!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Sort todos">
          Sort: {current.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={(e) => {
              e.preventDefault();
              onChange(option.value);
            }}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
