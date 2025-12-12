'use client';

import { Button } from '@/shared/ui';
import type { Todo } from '@/entities/todo';
import { useTodoSelection } from '../model/todo-selection-context';
import { useBulkTodoActions } from '../model/use-bulk-todo-actions';
import { useConfirm } from '@/shared/ui/dialog/confirm-dialog-provider';

interface TodoBulkActionsBarProps {
  allTodos: Todo[];
  visibleTodos: Todo[];
}

export function TodoBulkActionsBar({ allTodos, visibleTodos }: TodoBulkActionsBarProps) {
  const {
    selectionMode,
    selectedIds,
    enterSelectionMode,
    exitSelectionMode,
    selectIds,
    clearSelection,
  } = useTodoSelection();

  const confirm = useConfirm();
  const { setSelectedCompleted, deleteSelected, toggleAll, clearCompletedAll } =
    useBulkTodoActions();

  const selectedTodos = visibleTodos.filter((t) => selectedIds.includes(t.id));
  const allVisibleSelected =
    visibleTodos.length > 0 && selectedTodos.length === visibleTodos.length;

  if (!selectionMode) {
    const hasAnyActive = allTodos.some((t) => !t.completed);

    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={enterSelectionMode}>
          Select
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            void toggleAll(hasAnyActive);
          }}
        >
          {hasAnyActive ? 'Mark all done' : 'Mark all active'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            const ok = await confirm({
              title: 'Clear completed todos?',
              description: 'All completed todos will be permanently removed.',
              confirmLabel: 'Clear',
              cancelLabel: 'Cancel',
              variant: 'danger',
            });
            if (!ok) return;
            await clearCompletedAll();
          }}
        >
          Clear completed
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="text-sm text-gray-600">Selected: {selectedTodos.length}</div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (allVisibleSelected) {
            clearSelection();
            return;
          }
          selectIds(visibleTodos.map((t) => t.id));
        }}
        disabled={visibleTodos.length === 0}
      >
        {allVisibleSelected ? 'Clear' : 'Select all'}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          void setSelectedCompleted(
            selectedTodos.map((t) => t.id),
            true,
          );
        }}
        disabled={selectedTodos.length === 0}
      >
        Mark done
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          void setSelectedCompleted(
            selectedTodos.map((t) => t.id),
            false,
          );
        }}
        disabled={selectedTodos.length === 0}
      >
        Mark active
      </Button>

      <Button
        variant="danger"
        size="sm"
        onClick={async () => {
          const ok = await confirm({
            title: 'Delete selected todos?',
            description:
              'Selected todos will be deleted. You will be able to undo the action shortly.',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
            variant: 'danger',
          });
          if (!ok) return;

          await deleteSelected(selectedTodos);
          exitSelectionMode();
        }}
        disabled={selectedTodos.length === 0}
      >
        Delete
      </Button>

      <Button variant="ghost" size="sm" onClick={exitSelectionMode}>
        Done
      </Button>
    </div>
  );
}
