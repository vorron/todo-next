import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { z } from 'zod';
import { formatZodError } from './zod-utils';

// Для клиентской валидации форм
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { valid: true; data: T } | { valid: false; errors: Record<string, string> } {
  try {
    const validatedData = schema.parse(data);
    return { valid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = formatZodError(error);
      return { valid: false, errors };
    }

    console.error('Unexpected validation error:', error);
    return {
      valid: false,
      errors: { _form: 'Произошла непредвиденная ошибка при валидации' },
    };
  }
}

// Для API endpoints
export function validateApiResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: FetchBaseQueryError } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation Error:', error.issues);
      return {
        success: false,
        error: {
          status: 'CUSTOM_ERROR',
          error: 'Response validation failed',
          data: error.issues,
        } as FetchBaseQueryError,
      };
    }
    throw error;
  }
}
