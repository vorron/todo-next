// lib/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Todo', 'User'],
  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: 'http://localhost:3001/',
    })(args, api, extraOptions);
    
    console.log('API Request:', args);
    console.log('API Response:', result);
    
    return result;
  },
  endpoints: () => ({}),
});