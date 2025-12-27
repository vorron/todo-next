'use client';

import { ConfirmDialogProvider } from '@/shared/ui/dialog/confirm-dialog-provider';

import { AuthProvider } from './auth-provider';
import { NetworkProvider } from './network-provider';
import { StoreProvider } from './store-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AuthProvider>
        <NetworkProvider>
          <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
        </NetworkProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
