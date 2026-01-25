import { formatISO } from 'date-fns';

/**
 * Возвращает текущую дату в формате YYYY-MM-DD (локальная дата)
 */
export function getToday(): string {
  return formatISO(new Date(), { representation: 'date' });
}

/**
 * Возвращает текущую дату в формате YYYY-MM-DD с использованием нативного JS
 * Альтернатива, если date-fns недоступен
 */
export function getTodayNative(): string {
  return new Date().toLocaleDateString('en-CA');
}

/**
 * Округляет число до ближайшего кратного значения
 * @param value - исходное число
 * @param precision - точность округления (например, 15 для минут)
 * @returns округленное число
 */
export function roundToNearest(value: number, precision: number): number {
  return Math.round(value / precision) * precision;
}
