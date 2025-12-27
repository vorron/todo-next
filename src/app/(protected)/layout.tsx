import { type ReactNode } from 'react';

import { redirect } from 'next/navigation';

import { hasValidSession } from '@/features/auth/lib/server-session';
import { ROUTES } from '@/shared/config/routes';
import { HeaderProvider } from '@/shared/ui';
import { AppShell, Navbar } from '@/widgets';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const hasSession = await hasValidSession();

  if (!hasSession) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <HeaderProvider>
      <AppShell header={<Navbar />}>{children}</AppShell>
    </HeaderProvider>
  );
}
