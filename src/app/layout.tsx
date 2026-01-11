import { Inter } from 'next/font/google';

import './globals.css';
import { NetworkProvider } from '@/app/providers/network-provider';
import { ServerAuthProvider } from '@/app/providers/server-auth-provider';
import { StoreProvider } from '@/app/providers/store-provider';
import { Toaster, AppErrorBoundary } from '@/shared/ui';
import { ConfirmDialogProvider } from '@/shared/ui/dialog/confirm-dialog-provider';

import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Todo App - Production Ready',
    template: '%s | Todo App',
  },
  description: 'A modern todo app with Next.js 16 and best practices',
  keywords: ['todo', 'productivity', 'tasks', 'management'],
  authors: [{ name: 'Your Name' }],
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <AppErrorBoundary>
          <StoreProvider>
            <ServerAuthProvider>
              <NetworkProvider>
                <ConfirmDialogProvider>
                  <div className="min-h-full">{children}</div>
                  <Toaster />
                </ConfirmDialogProvider>
              </NetworkProvider>
            </ServerAuthProvider>
          </StoreProvider>
        </AppErrorBoundary>
      </body>
    </html>
  );
}
