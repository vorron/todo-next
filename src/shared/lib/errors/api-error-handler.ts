import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { toast } from '@/shared/ui';

/**
 * Типы для работы с ошибками API
 */
export type ApiError = FetchBaseQueryError | SerializedError;

export interface ErrorResponse {
    message: string;
    code?: string;
    details?: unknown;
}

/**
 * Проверка типа ошибки
 */
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
}

export function isSerializedError(error: unknown): error is SerializedError {
    return typeof error === 'object' && error != null && 'message' in error;
}

/**
 * Получение сообщения об ошибке
 */
export function getErrorMessage(error: ApiError): string {
    if (isFetchBaseQueryError(error)) {
        // FetchBaseQueryError
        if ('error' in error) {
            return error.error;
        }

        if ('data' in error && error.data) {
            const data = error.data as any;
            return data.message || data.error || 'An error occurred';
        }

        // HTTP статусы
        switch (error.status) {
            case 400:
                return 'Bad request. Please check your input.';
            case 401:
                return 'Unauthorized. Please log in.';
            case 403:
                return 'Forbidden. You do not have permission.';
            case 404:
                return 'Resource not found.';
            case 409:
                return 'Conflict. Resource already exists.';
            case 422:
                return 'Validation error. Please check your input.';
            case 429:
                return 'Too many requests. Please try again later.';
            case 500:
                return 'Internal server error. Please try again.';
            case 503:
                return 'Service unavailable. Please try again later.';
            default:
                return `Request failed with status ${error.status}`;
        }
    }

    if (isSerializedError(error)) {
        return error.message || 'An unexpected error occurred';
    }

    return 'An unexpected error occurred';
}

/**
 * Получение кода ошибки
 */
export function getErrorCode(error: ApiError): string | undefined {
    if (isFetchBaseQueryError(error)) {
        if ('data' in error && error.data) {
            const data = error.data as any;
            return data.code;
        }
    }
    return undefined;
}

/**
 * Обработчик ошибок с toast уведомлениями
 */
export function handleApiError(error: ApiError, customMessage?: string) {
    const message = customMessage || getErrorMessage(error);
    const code = getErrorCode(error);

    console.error('API Error:', { error, message, code });

    toast.error(message, {
        description: code ? `Error code: ${code}` : undefined,
    });
}

/**
 * Обработчик успешных операций
 */
export function handleApiSuccess(message: string, description?: string) {
    toast.success(message, {
        description,
    });
}

/**
 * Обработчик предупреждений
 */
export function handleApiWarning(message: string, description?: string) {
    toast.warning(message, {
        description,
    });
}

/**
 * Обработчик информационных сообщений
 */
export function handleApiInfo(message: string, description?: string) {
    toast.info(message, {
        description,
    });
}