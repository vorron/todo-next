'use client';

import { ConfirmationDialog } from '@/shared/ui/dialog/confirmation-dialog';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type ConfirmVariant = 'danger' | 'warning' | 'info';

interface ConfirmDialogOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  isOpen: boolean;
}

type ConfirmFn = (options: ConfirmDialogOptions) => Promise<boolean>;

const ConfirmDialogContext = createContext<ConfirmFn | null>(null);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmDialogState | null>(null);

  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const actionRef = useRef<'idle' | 'confirm'>('idle');

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      setState({
        isOpen: true,
        title: options.title,
        description: options.description,
        confirmLabel: options.confirmLabel,
        cancelLabel: options.cancelLabel,
        variant: options.variant ?? 'danger',
      });

      resolveRef.current = resolve;
      actionRef.current = 'idle';
    });
  }, []);

  const handleClose = useCallback(() => {
    // Закрываем диалог
    setState((prev) => (prev ? { ...prev, isOpen: false } : prev));

    // Если только что был confirm — onClose вызовется вторым, ничего не делаем
    if (actionRef.current === 'confirm') {
      actionRef.current = 'idle';
      return;
    }

    // Иначе считаем, что пользователь отменил (кнопка Cancel, ESC, клик вне)
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  }, []);

  const handleConfirm = useCallback(() => {
    actionRef.current = 'confirm';

    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }

    setState((prev) => (prev ? { ...prev, isOpen: false } : prev));
  }, []);

  const contextValue = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmDialogContext.Provider value={contextValue}>
      {children}

      {state && (
        <ConfirmationDialog
          isOpen={state.isOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title={state.title}
          description={state.description}
          confirmLabel={state.confirmLabel}
          cancelLabel={state.cancelLabel}
          variant={state.variant}
        />
      )}
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmDialogContext);

  if (!ctx) {
    throw new Error('useConfirm must be used within ConfirmDialogProvider');
  }

  return ctx;
}
