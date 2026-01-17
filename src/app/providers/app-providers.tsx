import { combineProviders } from '@/shared/lib/utils/combine-providers';
import { ConfirmDialogProvider } from '@/shared/ui/dialog/confirm-dialog-provider';

import { NetworkProvider } from './network-provider';
import { ServerAuthProvider } from './server-auth-provider';
import { StoreProvider } from './store-provider';

/**
 * 🎯 App Providers - Following 2024-2025 best practices
 *
 * Grouped by responsibility:
 * - State: StoreProvider
 * - Auth: ServerAuthProvider
 * - Network: NetworkProvider
 * - UI: ConfirmDialogProvider
 */
const CoreProviders = combineProviders(
  StoreProvider,
  ServerAuthProvider,
  NetworkProvider,
  ConfirmDialogProvider,
);

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <CoreProviders>{children}</CoreProviders>
);
