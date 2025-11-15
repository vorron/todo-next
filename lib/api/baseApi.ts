// lib/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Todo', 'User'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/',
    prepareHeaders: (headers) => {
      // Здесь можно добавить общую логику для headers
      // Например, токены аутентификации
      return headers;
    },
  }),
  endpoints: () => ({}), // endpoints будут инжектиться через injectEndpoints
});