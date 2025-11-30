
import type { ReactNode } from 'react';
import '../globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import { Toaster, AppErrorBoundary } from '@/shared/ui';

const inter = Inter({ subsets: ['latin'] });

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AppErrorBoundary>
                    <Providers>{children}</Providers>
                    <Toaster />
                </AppErrorBoundary>
            </body>
        </html>
    );
}