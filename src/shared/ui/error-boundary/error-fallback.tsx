'use client';

import { Button } from '@/shared/ui/button';
import { useRouter } from 'next/navigation';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="mt-4 text-xl font-semibold text-center text-gray-900">
          Oops! Something went wrong
        </h2>

        <p className="mt-2 text-sm text-center text-gray-600">
          We&apos;re sorry for the inconvenience. An error occurred while processing your request.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-mono text-red-600 break-all">{error.message}</p>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-xs text-gray-600 cursor-pointer">Stack trace</summary>
                <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-40">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button onClick={resetErrorBoundary} className="flex-1">
            Try Again
          </Button>
          <Button variant="secondary" onClick={handleGoHome} className="flex-1">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
