
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/config/routes';
import { Navbar } from '@/widgets';
import { hasValidSession } from '@/features/auth/lib/server-session';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const hasSession = await hasValidSession();

  if (!hasSession) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}