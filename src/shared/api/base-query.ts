import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

import { env } from '@/shared/config/env';

import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Определяем тип для extraOptions
type ExtraOptions = Record<string, unknown>;

export const baseQuery = retry(
  fetchBaseQuery({
    baseUrl: env.API_URL,
    timeout: 30000,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
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
    });
  }

  const result = await baseQuery(args, api, extraOptions);
  const duration = Date.now() - start;

  if (env.IS_DEVELOPMENT) {
    if (result.error) {
      const errorData = result.error.data;
      let safeErrorData = 'No error data';

      if (errorData) {
        try {
          safeErrorData =
            typeof errorData === 'string' ? errorData : JSON.stringify(errorData, null, 2);
        } catch {
          safeErrorData = 'Unserializable error data';
        }
      }

      console.error('🔴 API Error:', {
        endpoint: typeof args === 'string' ? args : args.url,
        status: result.error.status,
        statusText: result.error.status ? 'HTTP Error' : 'Network Error',
        error: safeErrorData,
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
