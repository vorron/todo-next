import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/app/providers';
import { Toaster, AppErrorBoundary } from '@/shared/ui';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Todo App - Production Ready',
    description: 'A modern todo app with Next.js 15 and best practices',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AppErrorBoundary>
                    <Providers>
                        {children}
                        <Toaster />
                    </Providers>
                </AppErrorBoundary>
            </body>
        </html>
    );
}