import { loginSchema } from '../model/auth-schema';
import type { LoginDto } from '../model/types';

/**
 * Валидация формы логина
 */
export function validateLoginForm(data: LoginDto): { valid: boolean; errors: Record<string, string> } {
    try {
        loginSchema.parse(data);
        return { valid: true, errors: {} };
    } catch (error: any) {
        const errors: Record<string, string> = {};

        error.errors?.forEach((err: any) => {
            errors[err.path[0]] = err.message;
        });

        return { valid: false, errors };
    }
}

/**
 * Mock проверка учетных данных
 * В реальном приложении будет API запрос
 */
export async function validateCredentials(username: string, password?: string): Promise<boolean> {
    // Для mock версии принимаем любой username длиной >= 3
    await new Promise((resolve) => setTimeout(resolve, 500)); // Имитация задержки сети
    return username.length >= 3;
}