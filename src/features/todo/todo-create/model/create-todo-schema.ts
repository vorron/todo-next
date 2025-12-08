import { z } from 'zod';

/**
 * Схема для формы создания todo
 */
export const createTodoFormSchema = z.object({
  text: z
    .string()
    .min(1, 'Todo text is required')
    .max(500, 'Todo text must be at most 500 characters'),
});

export type CreateTodoFormData = z.infer<typeof createTodoFormSchema>;
