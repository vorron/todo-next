// src/app/(protected)/layout.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/config/routes';
import { Navbar } from '@/widgets';
import { Spinner } from '@/shared/ui';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            redirect(ROUTES.LOGIN);
        }
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-full flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
        </div>
    );
}

// function isValidSession(): boolean {
//   const cookieStore = cookies();
//   const sessionExists = cookieStore.get('app_session_exists')?.value === 'true';
//   return sessionExists;
// }

// export default function ProtectedLayout({
//   children,
// }: { children: React.ReactNode }) {
//   if (!isValidSession()) {
//     redirect('/login'); // SSR-safe redirect
//   }

//   return (
//     <>
//       <Navbar />
//       {children}
//     </>
//   );
// }