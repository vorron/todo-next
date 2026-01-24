import { useRetryableRefetch } from '@/shared/hooks/use-retryable-refetch';
import { Card, CardContent, CardHeader, CardTitle, DataErrorState } from '@/shared/ui';

import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type TodoListErrorProps = {
  error: FetchBaseQueryError | SerializedError | undefined;
  refetch: () => void;
  title?: string;
};

export function TodoListError({ error, refetch, title = 'My Todos' }: TodoListErrorProps) {
  const { handleRetry, retryDisabled } = useRetryableRefetch(refetch);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataErrorState
          title="Failed to load todos"
          error={error}
          retryLabel={retryDisabled ? 'Please refresh page' : 'Try Again'}
          onRetry={retryDisabled ? undefined : handleRetry}
          _className="py-0"
        />
      </CardContent>
    </Card>
  );
}
