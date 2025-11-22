'use client';

import { Button } from '@/shared/ui';
import { useAuth } from '../model/use-auth';

interface LogoutButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LogoutButton({ variant = 'ghost', size = 'sm', className }: LogoutButtonProps) {
    const { logout, isLoading } = useAuth();

    return (
        <Button
            variant={variant}
            size={size}
            onClick={logout}
            isLoading={isLoading}
            disabled={isLoading}
            className={className}
        >
            {isLoading ? 'Logging out...' : 'Logout'}
        </Button>
    );
}