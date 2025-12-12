import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { AppShell, Navbar } from '@/widgets';
import { HeaderProvider } from '@/shared/ui';

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
    <HeaderProvider>
      <AppShell header={hasSession ? <Navbar /> : null}>{children}</AppShell>
    </HeaderProvider>
  );
}
