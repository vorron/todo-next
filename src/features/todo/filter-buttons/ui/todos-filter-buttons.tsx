'use client';

import type { FilterType } from '@/entities/todo';
import { FILTER_OPTIONS } from '@/entities/todo/model/filters';
import { Button } from '@/shared/ui';

interface TodosFilterButtonsProps {
  value: FilterType;
  onChange(value: FilterType): void;
}

export function TodosFilterButtons({ value, onChange }: TodosFilterButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTER_OPTIONS.map((option) => {
        const isActive = option.value === value;

        return (
          <Button
            key={option.value}
            variant={isActive ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
