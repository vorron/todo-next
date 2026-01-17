/**
 * Next.js redirect utilities
 * Инкапсуляция знаний о внутренностях Next.js redirect()
 */

/**
 * Проверяет, является ли ошибка Next.js redirect ошибкой
 * Next.js использует внутренний механизм броска Error('NEXT_REDIRECT') для выполнения редиректов
 *
 * @param error - Ошибка для проверки
 * @returns true если это Next.js redirect ошибка
 *
 * @example
 * ```typescript
 * try {
 *   await someAsyncOperation();
 *   redirect('/success');
 * } catch (error) {
 *   if (isRedirectError(error)) {
 *     throw error; // Пробрасываем - Next.js обработает
 *   }
 *
 *   // Обработка настоящих ошибок
 *   console.error('Real error:', error);
 * }
 * ```
 */
export function isRedirectError(error: unknown): error is Error & { message: string } {
  return error instanceof Error && error.message.includes('NEXT_REDIRECT');
}

/**
 * Безопасно выполняет операцию с редиректом, обрабатывая Next.js redirect ошибки
 *
 * @param operation - Асинхронная операция, которая может содержать redirect()
 * @returns Promise с результатом операции или never (если был redirect)
 *
 * @example
 * ```typescript
 * await safeRedirectOperation(async () => {
 *   const data = await fetchData();
 *   if (!data) redirect('/not-found');
 *   return data;
 * });
 * ```
 */
export async function safeRedirectOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isRedirectError(error)) {
      throw error; // Next.js обработает редирект
    }

    // Пробрасываем настоящие ошибки
    throw error;
  }
}
