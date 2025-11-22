'use client';

import { useSessionCookie } from '@/shared/lib/hooks';

/**
 * Провайдер для инициализации auth состояния
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    useSessionCookie();
    return <>{children}</>;
}