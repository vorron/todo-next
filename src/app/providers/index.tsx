'use client';

import { StoreProvider } from './store-provider';
import { AuthProvider } from './auth-provider';
import { NetworkProvider } from './network-provider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <StoreProvider>
            <AuthProvider>
                <NetworkProvider>
                    {children}
                </NetworkProvider>
            </AuthProvider>
        </StoreProvider>
    );
}