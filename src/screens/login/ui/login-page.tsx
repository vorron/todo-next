'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from '@/features/auth';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/config/routes';

export function LoginPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl') || ROUTES.TODOS;

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push(callbackUrl);
        }
    }, [isAuthenticated, isLoading, router, callbackUrl]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
                    <p className="mt-2 text-gray-600">Sign in to manage your todos</p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}