import { useEffect } from 'react';
import { sessionStorage } from '@/features/auth/lib/session';

/**
 * Hook для синхронизации localStorage session с cookie
 * Нужен для работы middleware
 */
export function useSessionCookie() {
    useEffect(() => {
        const updateCookie = () => {
            const hasSession = sessionStorage.isValid();

            if (hasSession) {
                document.cookie = 'app_session_exists=true; path=/; max-age=86400'; // 24 часа
            } else {
                document.cookie = 'app_session_exists=; path=/; max-age=0'; // Удаляем
            }
        };

        // Обновляем при монтировании
        updateCookie();

        // Слушаем изменения в localStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'app_session') {
                updateCookie();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);
}