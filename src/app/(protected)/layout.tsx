import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/config/routes';
import { AppShell, Navbar } from '@/widgets';
import { hasValidSession } from '@/features/auth/lib/server-session';
import { HeaderProvider } from '@/shared/ui';

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
