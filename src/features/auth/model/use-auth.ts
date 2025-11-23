import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { RootState } from '@/app/store';
import { setSession, clearSession, setLoading } from './auth-slice';
import { useLoginMutation, useLogoutMutation } from '../api/auth-api';
import { sessionStorage } from '../lib/session';
import type { LoginDto } from './types';
import { ROUTES } from '@/shared/config/routes';

type LoginResult =
    | { success: true; message: string }
    | { success: false; message: string };

interface ApiError {
    data?: {
        message?: string;
    };
}

export function useAuth() {
    const dispatch = useDispatch();
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth);

    const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
    const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

    useEffect(() => {
        const session = sessionStorage.get();
        if (session) {
            dispatch(setSession(session));
        } else {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const login = useCallback(
        async (credentials: LoginDto): Promise<LoginResult> => {
            try {
                const result = await loginMutation(credentials).unwrap();
                sessionStorage.save(result.session);
                dispatch(setSession(result.session));

                return {
                    success: true,
                    message: result.message
                };
            } catch (error: unknown) {
                const apiError = error as ApiError;
                const message = apiError.data?.message || 'Login failed';

                return {
                    success: false,
                    message, // всегда строка
                };
            }
        },
        [loginMutation, dispatch]
    );

    const logout = useCallback(async () => {
        try {
            await logoutMutation().unwrap();
            sessionStorage.clear();
            dispatch(clearSession());
            router.push(ROUTES.LOGIN);
        } catch (error: unknown) {
            // Все равно очищаем сессию даже при ошибке API
            sessionStorage.clear();
            dispatch(clearSession());
            router.push(ROUTES.LOGIN);

            const apiError = error as ApiError;
            const message = apiError.data?.message || 'Logout completed with warning';
            console.warn(message);
        }
    }, [logoutMutation, dispatch, router]);

    const requireAuth = useCallback(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            router.push(ROUTES.LOGIN);
        }
    }, [auth.isAuthenticated, auth.isLoading, router]);

    return {
        session: auth.session,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading || isLoggingIn || isLoggingOut,
        userId: auth.session?.userId,
        login,
        logout,
        requireAuth,
    };
}