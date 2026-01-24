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
  valueLabels?: Record<string, string>;
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  triggerClassName?: string;
  contentClassName?: string;
  align?: 'start' | 'center' | 'end' | undefined;
  size?: 'sm' | 'default' | 'lg' | 'compact' | 'wide';
  variant?: 'default' | 'outline';
  ariaLabel?: string;
  id?: string;
  disabled?: boolean;
}

export function Select<T extends string | number>({
  options,
  valueLabels,
  value,
  onChange,
  placeholder = 'Select option',
  triggerClassName,
  contentClassName,
  align = 'end',
  size = 'default',
  variant = 'default',
  ariaLabel,
  id,
  disabled = false,
}: SelectProps<T>) {
  const selectOptions =
    options || (valueLabels ? createOptions(valueLabels as Record<T, string>) : []);

  const current = selectOptions.find((o) => o.value === value);
  const triggerLabel = current ? current.label : placeholder;

  // Простая логика для размеров
  const getDropdownWidth = () => {
    if (contentClassName) return contentClassName;
    switch (size) {
      case 'compact':
        return 'w-32';
      case 'lg':
        return 'w-48';
      case 'wide':
        return 'w-64';
      default:
        return 'w-40';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={triggerClassName}
          aria-label={ariaLabel || placeholder}
          id={id}
          disabled={disabled}
        >
          {triggerLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={getDropdownWidth()}>
        {selectOptions.map((option) => (
          <DropdownMenuItem
            key={String(option.value)}
            onSelect={() => onChange(option.value)}
            aria-selected={option.value === value}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
