import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { RootState } from '@/app/store';
import { setSession, clearSession, setLoading } from './auth-slice';
import { useLoginMutation, useLogoutMutation } from '../api/auth-api';
import { sessionStorage } from '../lib/session';
import type { LoginDto } from './types';
import { ROUTES } from '@/shared/config/routes';

/**
 * Главный хук для работы с аутентификацией
 */
export function useAuth() {
    const dispatch = useDispatch();
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth);

    const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
    const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

    /**
     * Инициализация - восстановление сессии из localStorage
     */
    useEffect(() => {
        const session = sessionStorage.get();
        if (session) {
            dispatch(setSession(session));
        } else {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    /**
     * Логин
     */
    const login = useCallback(
        async (credentials: LoginDto) => {
            try {
                const result = await loginMutation(credentials).unwrap();

                // Сохраняем сессию
                sessionStorage.save(result.session);
                dispatch(setSession(result.session));

                return { success: true, message: result.message };
            } catch (error: any) {
                return {
                    success: false,
                    message: error.data?.message || 'Login failed',
                };
            }
        },
        [loginMutation, dispatch]
    );

    /**
     * Логаут
     */
    const logout = useCallback(async () => {
        try {
            await logoutMutation().unwrap();
            sessionStorage.clear();
            dispatch(clearSession());
            router.push(ROUTES.LOGIN);
        } catch (error) {
            // Даже если API запрос failed, очищаем локальную сессию
            sessionStorage.clear();
            dispatch(clearSession());
            router.push(ROUTES.LOGIN);
        }
    }, [logoutMutation, dispatch, router]);

    /**
     * Проверка авторизации с редиректом
     */
    const requireAuth = useCallback(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            router.push(ROUTES.LOGIN);
        }
    }, [auth.isAuthenticated, auth.isLoading, router]);

    return {
        // Состояние
        session: auth.session,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading || isLoggingIn || isLoggingOut,
        userId: auth.session?.userId,

        // Методы
        login,
        logout,
        requireAuth,
    };
}