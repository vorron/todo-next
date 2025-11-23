import { loginSchema } from '../model/auth-schema';
import type { LoginDto } from '../model/types';
import { handleZodError } from '@/shared/lib/utils';

interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

export function validateLoginForm(data: LoginDto): ValidationResult {
    try {
        loginSchema.parse(data);
        return { valid: true, errors: {} };
    } catch (error: unknown) {
        return handleZodError(error, {
            onZodError: (errors) => ({ valid: false, errors }),
            onOtherError: (error) => {
                console.error('Unexpected validation error:', error);
                return {
                    valid: false,
                    errors: { _form: 'Произошла непредвиденная ошибка при валидации' }
                };
            }
        });
    }
}

export async function validateCredentials(username: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return username.length >= 3;
}