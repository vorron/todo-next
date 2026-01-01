'use client';

import { ActionBar } from '@/shared/ui';
import { useConfirm } from '@/shared/ui/dialog/confirm-dialog-provider';

import type { ActionBarItem } from '@/shared/ui/action-bar';

interface TodoActionsHandlers {
  clearSelection: () => void;
  selectAll: () => void;
  delete: () => void | Promise<void>;
  clearCompletedAll: () => void | Promise<void>;
  refetch(): void;
}

interface TodoActionsBarProps {
  totalCount: number;
  selectedCount: number;
  hasCompleted: boolean;
  actions: TodoActionsHandlers;
}

export function TodoActionsBar({
  totalCount,
  selectedCount,
  hasCompleted,
  actions,
}: TodoActionsBarProps) {
  const confirm = useConfirm();

  const barActions: ActionBarItem[] = [
    {
      key: 'toggle-selection',
      label: selectedCount > 0 ? 'Clear selection' : 'Select all',
      onClick: () => {
        if (selectedCount > 0) {
          actions.clearSelection();
        } else {
          actions.selectAll();
        }
      },
      disabled: totalCount === 0,
      className: 'min-w-[140px] justify-start',
    },
    {
      key: 'delete',
      label: 'Delete',
      variant: 'danger' as const,
      confirm: {
        title: 'Delete selected todos?',
        description: 'Selected todos will be deleted. You will be able to undo the action shortly.',
      },
      onClick: actions.delete,
      disabled: selectedCount === 0,
    },
    {
      key: 'clear-completed',
      label: 'Clear completed',
      confirm: {
        title: 'Clear completed todos?',
        description: 'All completed todos will be permanently removed.',
      },
      onClick: actions.clearCompletedAll,
      disabled: !hasCompleted,
    },
    {
      key: 'refresh',
      label: 'Refresh',
      onClick: actions.refetch,
    },
  ];

  return (
    <ActionBar
      ariaLabel="Bulk actions for todos"
      size="md"
      wrap
      surface="muted"
      padding="sm"
      confirmDialog={confirm}
      actions={barActions}
    />
  );
}
