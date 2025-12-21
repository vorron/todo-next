'use client';

import { SORT_VALUES, type TodoSortBy } from '@/entities/todo';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui';

export type TodoSortOption = {
  value: TodoSortBy;
  label: string;
};

const SORT_LABELS: Record<TodoSortBy, string> = {
  date: 'Newest',
  priority: 'Priority',
  alphabetical: 'A–Z',
};

const SORT_OPTIONS: TodoSortOption[] = SORT_VALUES.map((value) => ({
  value,
  label: SORT_LABELS[value],
}));

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
