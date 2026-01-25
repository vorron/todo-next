import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

/**
 * Base query configuration for RTK Query
 * Points to Nest.js backend
 */
export const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001/api',
  prepareHeaders: (headers) => {
    // Add authentication headers if needed
    // headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

/**
 * Enhanced base query with error handling and logging
 */
export const baseQueryWithLogging: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.error('🔴 API Error:', {
      endpoint: typeof args === 'string' ? args : args.url,
      status: result.error.status,
      data: result.error.data,
    });
  }

  return result;
};
