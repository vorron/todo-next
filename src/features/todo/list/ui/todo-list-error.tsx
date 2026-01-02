import { type SerializedError } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { useRetryableRefetch } from '@/shared/hooks/use-retryable-refetch';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';

type TodoListErrorProps = {
  error: FetchBaseQueryError | SerializedError | undefined;
  refetch: () => void;
  title?: string;
};

export function TodoListError({ error, refetch, title = 'My Todos' }: TodoListErrorProps) {
  const { handleRetry, retryDisabled } = useRetryableRefetch(refetch);
  const errorMessage = error && 'status' in error ? `Error: ${error.status}` : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load todos</h3>
          <p className="text-sm text-gray-600 mb-4">{errorMessage ?? 'Please try again'}</p>
          <Button onClick={handleRetry} variant="default" disabled={retryDisabled}>
            {retryDisabled ? 'Please refresh page' : 'Try Again'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
