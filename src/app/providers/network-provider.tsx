'use client';

import { useNetworkStatus } from '@/shared/lib/hooks';

/**
 * Провайдер для отслеживания статуса сети
 */
export function NetworkProvider({ children }: { children: React.ReactNode }) {
    useNetworkStatus();
    return <>{children}</>;
}