'use client';

import { Suspense } from 'react';
import { LoginContent } from './login-content';
import { LoginPageSkeleton } from './login-page-skeleton';

export function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}
