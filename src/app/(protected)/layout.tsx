import { type ReactNode } from 'react';

import { redirect } from 'next/navigation';

import { getCurrentUserId } from '@/lib/auth-server';
import { ROUTES } from '@/shared/lib/router';
import { HeaderProvider } from '@/shared/ui';
import { AppShell, Navbar } from '@/widgets';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <HeaderProvider>
      <AppShell header={<Navbar />}>{children}</AppShell>
    </HeaderProvider>
  );
}
