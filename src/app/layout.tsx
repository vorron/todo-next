import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/app/providers';
import { Toaster, AppErrorBoundary } from '@/shared/ui';
import { Navbar } from '@/widgets';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Todo App - Production Ready',
    template: '%s | Todo App',
  },
  description: 'A modern todo app with Next.js 15 and best practices',
  keywords: ['todo', 'productivity', 'tasks', 'management'],
  authors: [{ name: 'Your Name' }],
  // viewport: 'width=device-width, initial-scale=1, user-scalable=no',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <AppErrorBoundary>
          <Providers>
            <div className="min-h-full flex flex-col">
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </Providers>
        </AppErrorBoundary>
      </body>
    </html>
  );
}
