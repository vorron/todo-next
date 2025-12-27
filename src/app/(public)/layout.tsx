import { cookies } from 'next/headers';

import { HeaderProvider } from '@/shared/ui';
import { AppShell, Navbar } from '@/widgets';

import type { ReactNode } from 'react';

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
