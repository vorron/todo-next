import { z } from 'zod';

/**
 * Схема для логина
 */
export const loginSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .optional(), // Для mock версии пароль опционален
});

/**
 * Схема для сессии
 */
export const sessionSchema = z.object({
    userId: z.string().uuid(),
    username: z.string(),
    name: z.string(),
    expiresAt: z.string().datetime(),
});

/**
 * Типы
 */
export type LoginDto = z.infer<typeof loginSchema>;
export type Session = z.infer<typeof sessionSchema>;