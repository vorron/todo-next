'use client';

import { type Option, createOptions } from '@/shared/lib/utils';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui';

export interface SelectProps<T extends string | number> {
  options?: Option<T>[];
  valueLabels?: Record<T, string>;
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  triggerClassName?: string;
  contentClassName?: string;
  align?: 'start' | 'center' | 'end' | undefined;
}

export function Select<T extends string | number>({
  options,
  valueLabels,
  value,
  onChange,
  placeholder = 'Select option',
  triggerClassName,
  contentClassName = 'w-40',
  align = 'end',
}: SelectProps<T>) {
  const selectOptions = options || (valueLabels ? createOptions(valueLabels) : []);

  const current = selectOptions.find((o) => o.value === value);
  const triggerLabel = current ? current.label : placeholder;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={triggerClassName} aria-label={placeholder}>
          {triggerLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={contentClassName}>
        {selectOptions.map((option) => (
          <DropdownMenuItem
            key={String(option.value)}
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
