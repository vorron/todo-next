'use client';

import type { Todo } from '@/entities/todo';
import { ActionBar } from '@/shared/ui';
import { useConfirm } from '@/shared/ui/dialog/confirm-dialog-provider';
import { useTodoSelection } from '../model/todo-selection-context';

import type { ActionBarItem } from '@/shared/ui/action-bar';

type TodoActionsHandlers = {
  clearSelection: () => void;
  selectAll: () => void;
  delete: () => void | Promise<void>;
  clearCompletedAll: () => void | Promise<void>;
  refetch(): void;
};

interface TodoActionsBarProps {
  visibleTodos: Todo[];
  actions: TodoActionsHandlers;
}

export function TodoActionsBar({ visibleTodos, actions }: TodoActionsBarProps) {
  const { selectedIds } = useTodoSelection();

  const confirm = useConfirm();

  const selectedTodos = visibleTodos.filter((t) => selectedIds.includes(t.id));

  const barActions: ActionBarItem[] = [
    {
      key: 'toggle-selection',
      label: selectedIds.length > 0 ? 'Clear selection' : 'Select all',
      onClick: () => {
        if (selectedIds.length > 0) {
          actions.clearSelection();
        } else {
          actions.selectAll();
        }
      },
      disabled: visibleTodos.length === 0,
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
      disabled: selectedTodos.length === 0,
    },
    {
      key: 'clear-completed',
      label: 'Clear completed',
      confirm: {
        title: 'Clear completed todos?',
        description: 'All completed todos will be permanently removed.',
      },
      onClick: actions.clearCompletedAll,
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
