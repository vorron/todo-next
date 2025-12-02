import { z } from 'zod';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

export function handleRTKQueryValidation<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  data: unknown,
): { data: z.infer<TSchema> } | { error: FetchBaseQueryError } {
  try {
    const validatedData = schema.parse(data);
    return { data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation Error:', error.issues);
      return {
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
