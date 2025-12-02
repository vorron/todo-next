'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Логирование ошибки
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h2 className="mt-4 text-xl font-semibold text-center text-gray-900">
          Something went wrong!
        </h2>

        <p className="mt-2 text-sm text-center text-gray-600">
          We apologize for the inconvenience. Please try again.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-mono text-red-600 break-all">{error.message}</p>
          </div>
        )}

        <div className="mt-6">
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
