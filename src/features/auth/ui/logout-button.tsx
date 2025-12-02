'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui';
import { useAuth } from '../model/use-auth';
import { ConfirmationDialog } from '@/shared/ui';

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withConfirmation?: boolean;
  showIcon?: boolean;
}

export function LogoutButton({
  variant = 'ghost',
  size = 'sm',
  className,
  withConfirmation = true,
  showIcon = true,
}: LogoutButtonProps) {
  const { logout, isLoading } = useAuth();
  const [showDialog, setShowDialog] = useState(false);

  const handleLogout = () => {
    if (withConfirmation) {
      setShowDialog(true);
    } else {
      logout();
    }
  };

  const handleConfirm = () => {
    setShowDialog(false);
    logout();
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleLogout}
        isLoading={isLoading}
        disabled={isLoading}
        className={className}
      >
        {showIcon && (
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        )}
        {isLoading ? 'Signing out...' : 'Sign out'}
      </Button>

      {withConfirmation && (
        <ConfirmationDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          onConfirm={handleConfirm}
          title="Ready to leave?"
          description="Are you sure you want to sign out? You'll need to sign in again to access your todos."
          confirmLabel="Sign out"
          cancelLabel="Stay logged in"
          variant="warning"
          isLoading={isLoading}
        />
      )}
    </>
  );
}
