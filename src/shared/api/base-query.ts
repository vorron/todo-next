import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { z } from "zod";
import { env } from "@/shared/config/env";

/**
 * Базовый query с автоматической валидацией через Zod
 */
export const baseQuery = fetchBaseQuery({
  baseUrl: env.API_URL,
  prepareHeaders: (headers) => {
    // Добавляем базовые заголовки
    headers.set("Content-Type", "application/json");

    // TODO: Добавить токен авторизации
    // const token = getAuthToken();
    // if (token) {
    //   headers.set('Authorization', `Bearer ${token}`);
    // }

    return headers;
  },
});

/**
 * Query wrapper с логированием и обработкой ошибок
 */
export const baseQueryWithLogging: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  Record<string, unknown>,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const start = Date.now();

  // Логируем запрос в development
  if (env.IS_DEVELOPMENT) {
    console.log("🔵 API Request:", {
      endpoint: typeof args === "string" ? args : args.url,
      method: typeof args === "string" ? "GET" : args.method || "GET",
      timestamp: new Date().toISOString(),
    });
  }

  const result = await baseQuery(args, api, extraOptions);

  const duration = Date.now() - start;

  // Логируем результат
  if (env.IS_DEVELOPMENT) {
    if (result.error) {
      console.error("🔴 API Error:", {
        endpoint: typeof args === "string" ? args : args.url,
        error: result.error,
        duration: `${duration}ms`,
      });
    } else {
      console.log("🟢 API Success:", {
        endpoint: typeof args === "string" ? args : args.url,
        duration: `${duration}ms`,
      });
    }
  }

  return result;
};

/**
 * Хелпер для создания валидированного query
 */
export function createValidatedQuery<TSchema extends z.ZodTypeAny>(
  schema: TSchema
) {
  return async (
    args: string | FetchArgs,
    api: Parameters<typeof baseQueryWithLogging>[1],
    extraOptions: Parameters<typeof baseQueryWithLogging>[2]
  ): Promise<{ data: z.infer<TSchema> } | { error: FetchBaseQueryError }> => {
    const result = await baseQueryWithLogging(args, api, extraOptions);

    if (result.error) {
      return { error: result.error };
    }

    try {
      // Валидируем данные через Zod
      const validatedData = schema.parse(result.data);
      return { data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("❌ Validation Error:", error.issues);

        const originalStatus = result.meta?.response?.status ?? 200;

        // Создаем корректный объект ошибки для RTK Query
        const validationError: FetchBaseQueryError = {
          status: "PARSING_ERROR",
          originalStatus,
          data: JSON.stringify({
            message: "Response validation failed",
            validationErrors: error.issues,
          }),
          error: "Response validation failed",
        };

        return { error: validationError };
      }

      // Для других ошибок создаем CUSTOM_ERROR
      console.error("❌ Unknown error during validation:", error);
      const unknownError: FetchBaseQueryError = {
        status: "CUSTOM_ERROR",
        error: "Unknown error during validation",
      };

      return { error: unknownError };
    }
  };
}
