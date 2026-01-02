import { type Option, createOptions } from '@/shared/lib/utils';

import { Button } from './button';

interface FilterButtonsProps<T extends string | number> {
  value: T;
  onChange(value: T): void;
  options?: Option<T>[];
  valueLabels?: Record<T, string>;
}

export function FilterButtons<T extends string | number>({
  value,
  onChange,
  options,
  valueLabels,
}: FilterButtonsProps<T>) {
  const resolvedOptions = options || (valueLabels ? createOptions(valueLabels) : []);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {resolvedOptions.map((option) => {
        const isActive = option.value === value;

        return (
          <Button
            key={option.value}
            variant={isActive ? 'default' : 'ghost'}
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
