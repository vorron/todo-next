'use client';

import { useEffect } from 'react';

import { Button } from '@/shared/ui';

/**
 * 🎯 Global Error Boundary
 *
 * Handles critical errors that occur in the root layout
 * or when no segment-level error boundary is available
 *
 * Follows Next.js 15+ App Router best practices
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical errors for monitoring
    console.error('Global Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // In production, send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with Sentry, LogRocket, or similar
      // errorMonitoring.captureException(error);
    }
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8">
            {/* Critical Error Icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Critical Application Error
            </h2>

            {/* Error Description */}
            <p className="text-center text-gray-600 mb-6">
              A critical error occurred that affected the entire application. Our team has been
              notified and is working on a fix.
            </p>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Error Details (Development Only)
                </h3>
                <div className="space-y-2">
                  <p className="text-xs font-mono text-red-700 break-all">
                    <strong>Message:</strong> {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs font-mono text-red-700">
                      <strong>Digest:</strong> {error.digest}
                    </p>
                  )}
                  {error.stack && (
                    <details className="text-xs font-mono text-red-600">
                      <summary className="cursor-pointer font-semibold">Stack Trace</summary>
                      <pre className="mt-2 whitespace-pre-wrap break-all">{error.stack}</pre>
                    </details>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={reset} className="w-full" variant="default">
                Try Again
              </Button>

              <Button onClick={() => window.location.reload()} className="w-full" variant="outline">
                Refresh Page
              </Button>
            </div>

            {/* Support Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                If the problem persists, please contact support
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
