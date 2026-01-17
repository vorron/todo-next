import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

import { env } from '@/shared/config/env';

import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Определяем тип для extraOptions
type ExtraOptions = Record<string, unknown>;

export const baseQuery = retry(
  fetchBaseQuery({
    baseUrl: env.API_URL,
    timeout: 10000,
    prepareHeaders: (headers) => {
      // Устанавливаем Content-Type по умолчанию
      // Для GET запросов он не вызовет лишних CORS preflight
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  { maxRetries: 3 },
);

export const baseQueryWithLogging: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ExtraOptions
> = async (args, api, extraOptions) => {
  const start = Date.now();

  if (env.IS_DEVELOPMENT) {
    console.log('🔵 API Request:', {
      endpoint: typeof args === 'string' ? args : args.url,
      method: typeof args === 'string' ? 'GET' : args.method || 'GET',
      timestamp: new Date().toISOString(),
    });
  }

  const result = await baseQuery(args, api, extraOptions);
  const duration = Date.now() - start;

  if (env.IS_DEVELOPMENT) {
    if (result.error) {
      console.error('🔴 API Error:', {
        endpoint: typeof args === 'string' ? args : args.url,
        error: result.error,
        duration: `${duration}ms`,
      });
    } else {
      console.log('🟢 API Success:', {
        endpoint: typeof args === 'string' ? args : args.url,
        duration: `${duration}ms`,
      });
    }
  }

  return result;
};
