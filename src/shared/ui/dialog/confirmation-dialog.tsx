'use client';

import { Button } from '../button';
import { useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/utils';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Закрытие по клику вне диалога
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
      button: 'danger' as const,
    },
    warning: {
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      button: 'primary' as const,
    },
    info: {
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
      button: 'primary' as const,
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
      >
        {/* Icon */}
        <div
          className={cn(
            'flex items-center justify-center w-12 h-12 mx-auto rounded-full',
            styles.iconBg,
          )}
        >
          <svg
            className={cn('w-6 h-6', styles.icon)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">
            {cancelLabel}
          </Button>
          <Button
            variant={styles.button}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            isLoading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
