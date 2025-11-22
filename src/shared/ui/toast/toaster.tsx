'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
    return (
        <Sonner
            position="top-right"
            expand={false}
            richColors
            closeButton
            duration={4000}
            toastOptions={{
                classNames: {
                    toast: 'rounded-lg shadow-lg',
                    title: 'text-sm font-medium',
                    description: 'text-sm text-gray-600',
                    actionButton: 'bg-blue-500 text-white',
                    cancelButton: 'bg-gray-200 text-gray-800',
                    closeButton: 'bg-white border border-gray-300',
                },
            }}
        />
    );
}