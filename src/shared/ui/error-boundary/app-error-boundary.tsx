'use client';

import { useEffect, useState } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from './error-fallback';

import type { ErrorInfo } from 'react';

export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [resetKey, setResetKey] = useState<string | null>(null);

  // Устанавливаем resetKey только на клиенте
  useEffect(() => {
    setResetKey(pathname);
  }, [pathname]);

  const handleError = (error: unknown, info: ErrorInfo) => {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    console.error('Error caught by boundary:', errorObj, info);

    if (process.env.NODE_ENV === 'production') {
      // sendErrorToMonitoring(errorObj, info);
    } else {
      console.group('Error Details');
      console.error('Component Stack:', info.componentStack);
      console.groupEnd();
    }
  };

  const handleReset = () => {
    setTimeout(() => {
      router.push('/');
      // Используем window только после проверки
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback
          error={error instanceof Error ? error : new Error(String(error))}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
      onError={handleError}
      onReset={handleReset}
      // Передаем resetKey только если он установлен (на клиенте)
      resetKeys={resetKey ? [resetKey] : undefined}
    >
      {children}
    </ErrorBoundary>
  );
}
