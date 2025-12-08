import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { Navbar } from '@/widgets';

interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * Public layout — доступен без авторизации
 * Показывает Navbar если пользователь авторизован
 */
export default async function PublicLayout({ children }: PublicLayoutProps) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has('app_session_exists');

  return (
    <div className="min-h-full flex flex-col">
      {hasSession && <Navbar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
