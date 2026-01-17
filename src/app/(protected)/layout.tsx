import { type ReactNode } from 'react';

import { requireAuth } from '@/features/auth';
import { HeaderProvider } from '@/shared/ui';
import { AppShell, Navbar } from '@/widgets';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  await requireAuth();

  return (
    <HeaderProvider>
      <AppShell header={<Navbar />}>{children}</AppShell>
    </HeaderProvider>
  );
}
