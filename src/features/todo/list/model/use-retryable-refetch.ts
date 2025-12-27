import { useState, useCallback } from 'react';

export function useRetryableRefetch(refetch: () => void, maxRetries = 3) {
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    refetch();
  }, [refetch]);

  return {
    retryCount,
    retryDisabled: retryCount >= maxRetries,
    handleRetry,
  };
}
