import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    BaseQueryApi
} from '@reduxjs/toolkit/query';
import { z } from 'zod';
import { env } from '@/shared/config/env';
import { handleRTKQueryValidation } from '../lib/utils';

// Определяем тип для extraOptions
type ExtraOptions = Record<string, unknown> & {
    shout?: boolean; // пример дополнительных опций
};

export const baseQuery = fetchBaseQuery({
    baseUrl: env.API_URL,
    prepareHeaders: (headers) => {
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

export const baseQueryWithLogging: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    ExtraOptions // добавляем тип для extraOptions
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

export function createValidatedQuery<TSchema extends z.ZodTypeAny>(
    schema: TSchema
) {
    return async (
        args: string | FetchArgs,
        api: BaseQueryApi,
        extraOptions: ExtraOptions
    ): Promise<{ data: z.infer<TSchema> } | { error: FetchBaseQueryError }> => {
        const result = await baseQueryWithLogging(args, api, extraOptions);

        if (result.error) {
            return { error: result.error };
        }

        // Заменяем блок try-catch на вызов хелпера
        return handleRTKQueryValidation(schema, result.data);
    };
} 