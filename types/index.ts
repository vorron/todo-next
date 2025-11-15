import { EndpointBuilder, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

// Более точная типизация
export type AppBaseQuery = BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {}, // Extra options
    FetchBaseQueryMeta // Metadata
>;
export type AppBuilder = EndpointBuilder<AppBaseQuery, 'Todo' | 'User', 'api'>;

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    username: string;
    name: string;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoState {
    filter: FilterType;
}