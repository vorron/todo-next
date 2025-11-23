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

// import { z } from 'zod';
// import { loginSchema } from '../model/auth-schema';
// import type { LoginDto } from '../model/types';

// interface ValidationResult {
//     valid: boolean;
//     errors: Record<string, string>;
// }

// interface ZodErrorIssue {
//     path: (string | number)[];
//     message: string;
// }

// export function validateLoginForm(data: LoginDto): ValidationResult {
//     try {
//         loginSchema.parse(data);
//         return { valid: true, errors: {} };
//     } catch (error: unknown) {
//         const errors: Record<string, string> = {};

//         if (error instanceof z.ZodError) {
//             error.errors.forEach((err: ZodErrorIssue) => {
//                 const fieldName = err.path[0]?.toString();
//                 if (fieldName) {
//                     errors[fieldName] = err.message;
//                 }
//             });
//         }

//         return { valid: false, errors };
//     }
// }

// export async function validateCredentials(username: string): Promise<boolean> {
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     return username.length >= 3;
// }