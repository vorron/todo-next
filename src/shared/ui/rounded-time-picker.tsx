'use client';

import * as React from 'react';

import { TimePicker } from '@/shared/ui/time-picker';

import type { TimePickerProps } from '@/shared/ui/time-picker';

/**
 * Props для RoundedTimePicker
 */
export interface RoundedTimePickerProps extends Omit<TimePickerProps, 'step'> {
  /** Точность округления в минутах */
  precision?: 5 | 10 | 15 | 30;
}

/**
 * Округляет время до указанной точности
 */
function roundTime(time: string, precision: number): string {
  if (!time) return time;

  const timeParts = time.split(':').map((part) => parseInt(part, 10));
  const hours = timeParts[0];
  const minutes = timeParts[1];

  if (hours === undefined || minutes === undefined || isNaN(hours) || isNaN(minutes)) return time;

  const roundedMinutes = Math.round(minutes / precision) * precision;

  // Обработка случая, когда округление приводит к следующему часу
  let finalHours = hours;
  let finalMinutes = roundedMinutes;

  if (roundedMinutes >= 60) {
    finalHours = (hours + 1) % 24;
    finalMinutes = 0;
  }

  return `${finalHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
}

/**
 * TimePicker с автоматическим округлением времени
 *
 * @example
 * ```tsx
 * <RoundedTimePicker
 *   value={time}
 *   onChange={setTime}
 *   precision={15}
 *   placeholder="Select time"
 * />
 * ```
 */
export function RoundedTimePicker({
  value,
  onChange,
  precision = 15,
  ...props
}: RoundedTimePickerProps) {
  // Вычисляем округленное значение для отображения
  const roundedValue = value ? roundTime(value, precision) : value;

  // Конвертируем точность в step для HTML5
  const step = precision * 60;

  const handleChange = (newValue: string) => {
    if (!newValue) {
      onChange('');
      return;
    }

    // Применяем округление при изменении
    const roundedValue = roundTime(newValue, precision);
    onChange(roundedValue);
  };

  return <TimePicker value={roundedValue} onChange={handleChange} step={step} {...props} />;
}
