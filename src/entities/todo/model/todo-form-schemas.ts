import { z } from 'zod';

/**
 * Базовая схема для всех форм todo
 * Содержит все возможные поля для максимальной гибкости
 */
export const todoFormBaseSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Todo text is required')
    .max(500, 'Todo text must be at most 500 characters'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), 'Please provide a valid date'),
  tagsInput: z
    .string()
    .max(200, 'Tags must be at most 200 characters')
    .transform((value) => value?.trim() || ''),
});

/**
 * Схема для формы создания todo (только обязательные поля)
 */
export const createTodoFormSchema = todoFormBaseSchema.pick({
  text: true,
});

/**
 * Схема для формы редактирования todo (все поля)
 */
export const editTodoFormSchema = todoFormBaseSchema;

/**
 * Типы данных для форм
 */
export type TodoFormBaseData = z.infer<typeof todoFormBaseSchema>;
export type CreateTodoFormData = z.infer<typeof createTodoFormSchema>;
export type EditTodoFormData = z.infer<typeof editTodoFormSchema>;

/**
 * Вспомогательные функции для работы с формами
 */
export const parseTagsInput = (tagsInput: string): string[] => {
  return tagsInput
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

export const formatTagsForInput = (tags: string[] = []): string => {
  return tags.join(', ');
};

export const toDateInputValue = (date?: string | null): string => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
};
