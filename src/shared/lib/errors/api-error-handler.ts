import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { type SerializedError } from '@reduxjs/toolkit';
import { toast } from '@/shared/ui';

export type ApiError = FetchBaseQueryError | SerializedError | Error;

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

interface ZodErrorData {
  issues: Array<{ path: string[]; message: string }>;
}

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function isSerializedError(error: unknown): error is SerializedError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export function isZodError(error: unknown): error is ZodErrorData {
  return typeof error === 'object' && error !== null && 'issues' in error;
}

export function getErrorMessage(error: ApiError): string {
  if (isFetchBaseQueryError(error)) {
    if ('error' in error) {
      return error.error;
    }

    if ('data' in error && error.data) {
      const data = error.data as ErrorResponse | ZodErrorData;

      if (isZodError(data)) {
        const firstIssue = data.issues[0];
        return firstIssue?.message || 'Validation error';
      }

      if (typeof data === 'object' && 'message' in data) {
        return data.message || 'An error occurred';
      }
    }

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

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

export function handleApiError(error: ApiError, customMessage?: string) {
  const message = customMessage || getErrorMessage(error);

  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }

  toast.error(message);
}

export function handleApiSuccess(message: string, description?: string) {
  toast.success(message, {
    description,
  });
}
