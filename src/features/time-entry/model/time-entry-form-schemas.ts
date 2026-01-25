import { z } from 'zod';

import { getToday, roundToNearest } from '@/shared/lib/utils';

/**
 * Схема для формы создания time entry
 * Добавляет UI-специфичные валидации и значения по умолчанию
 */
export const timeEntryFormSchema = z.object({
  // Переопределяем поля с UI-специфичной логикой

  description: z.string().min(1, 'Описание задачи обязательно').max(500, 'Максимум 500 символов'),

  projectId: z.string().min(1, 'Выберите проект'),

  date: z.string().min(1, 'Дата обязательна'),

  startTime: z
    .string()
    .min(1, 'Время начала обязательно')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Формат времени ЧЧ:ММ'),

  // UI-специфичные поля

  duration: z
    .number()
    .min(1, 'Минимум 1 минута')
    .max(24 * 60, 'Максимум 24 часа'),

  endTime: z.string().nullable().optional(),

  tags: z.array(z.string().min(1).max(50)).max(10, 'Максимум 10 тегов'),

  userId: z.string(),

  taskId: z.string().optional(),
});

/**
 * Типы для формы
 */
export type TimeEntryFormData = z.infer<typeof timeEntryFormSchema>;

/**
 * Значения по умолчанию для формы
 */
export const getDefaultTimeEntryFormValues = (): TimeEntryFormData => ({
  description: '',
  projectId: '',
  date: getToday(),
  startTime: (() => {
    const now = new Date();
    const minutes = roundToNearest(now.getMinutes(), 15);
    return `${String(now.getHours()).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  })(),
  duration: 60,
  endTime: null,
  tags: [],
  userId: '', // будет установлено в хуке
});

/**
 * Вспомогательные функции для формы
 */

export const formatTimeForInput = (time: string): string => {
  return time;
};

export const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = (hours || 0) * 60 + (minutes || 0) + duration;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

export const roundTimeToNearest = (time: string, precision: number = 15): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const roundedMinutes = roundToNearest(minutes || 0, precision);
  return `${String(hours).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;
};
