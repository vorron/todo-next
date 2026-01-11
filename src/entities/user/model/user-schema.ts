import { z } from 'zod';

/**
 * Zod схема для пользователя
 * Автоматически генерирует TypeScript типы
 */
export const userSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscore'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: z.string().email('Invalid email format').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  createdAt: z.string().datetime().optional(),
});

// Схема для массива пользователей
export const usersSchema = z.array(userSchema);

// Схема для создания пользователя (без id и createdAt)
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
});

// Схема для обновления пользователя (все поля опциональны кроме id)
export const updateUserSchema = userSchema.partial().required({ id: true });

/**
 * TypeScript типы, автоматически выведенные из схем
 */
export type User = z.infer<typeof userSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
