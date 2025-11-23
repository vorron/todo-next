'use client';

import { ErrorBoundary } from 'react-error-boundary';
import type { ErrorInfo } from 'react';
import { ErrorFallback } from './error-fallback';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AppErrorBoundaryProps {
    children: React.ReactNode;
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [resetKey, setResetKey] = useState<string | null>(null);

    // Устанавливаем resetKey только на клиенте
    useEffect(() => {
        setResetKey(pathname);
    }, [pathname]);

    const handleError = (error: Error, info: ErrorInfo) => {
        console.error('Error caught by boundary:', error, info);

        if (process.env.NODE_ENV === 'production') {
            // sendErrorToMonitoring(error, info);
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
            FallbackComponent={ErrorFallback}
            onError={handleError}
            onReset={handleReset}
            // Передаем resetKey только если он установлен (на клиенте)
            resetKeys={resetKey ? [resetKey] : undefined}
        >
            {children}
        </ErrorBoundary>
    );
}