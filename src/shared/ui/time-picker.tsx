'use client';

import * as React from 'react';

import { cn } from '@/shared/lib/utils';

export interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  step?: number; // HTML5 step attribute in seconds
  min?: string; // "00:00"
  max?: string; // "23:59"
  'aria-label'?: string;
  'aria-describedby'?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function TimePicker({
  value,
  onChange,
  placeholder = 'Select time',
  disabled = false,
  className,
  id,
  step,
  min,
  max,
  'aria-label': ariaLabel = placeholder,
  'aria-describedby': ariaDescribedBy,
  ref,
}: TimePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      ref={ref}
      type="time"
      id={id}
      value={value || ''}
      onChange={handleChange}
      disabled={disabled}
      step={step}
      min={min}
      max={max}
      placeholder={placeholder}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    />
  );
}
