'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './error-fallback';

interface AppErrorBoundaryProps {
    children: React.ReactNode;
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
    const handleError = (error: Error, info: { componentStack: string }) => {
        // Логирование ошибки (в production - отправка в Sentry/LogRocket)
        console.error('Error caught by boundary:', error, info);

        // TODO: Отправить в сервис мониторинга
        // if (process.env.NODE_ENV === 'production') {
        //   sendErrorToMonitoring(error, info);
        // }
    };

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={handleError}
            onReset={() => {
                // Очистка состояния при сбросе
                window.location.href = '/';
            }}
        >
            {children}
        </ErrorBoundary>
    );
}