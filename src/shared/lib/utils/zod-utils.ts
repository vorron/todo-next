import { z } from 'zod';

export function formatZodError(error: z.ZodError): Record<string, string> {
  return error.issues.reduce((acc: Record<string, string>, issue) => {
    const fieldName = issue.path[0]?.toString() || '_form';
    acc[fieldName] = issue.message;
    return acc;
  }, {});
}

export function handleZodError<T>(
  error: unknown,
  options?: {
    onZodError?: (formattedErrors: Record<string, string>) => T;
    onOtherError?: (error: unknown) => T;
  },
): T {
  if (error instanceof z.ZodError) {
    const formattedErrors = formatZodError(error);
    return options?.onZodError?.(formattedErrors) as T;
  }

  // Обработка других ошибок
  return options?.onOtherError?.(error) as T;
}
