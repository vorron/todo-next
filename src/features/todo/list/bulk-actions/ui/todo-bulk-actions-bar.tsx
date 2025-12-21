'use client';

import { Button } from '@/shared/ui';
import type { Todo } from '@/entities/todo';
import { useConfirm } from '@/shared/ui/dialog/confirm-dialog-provider';
import { useTodoSelection } from '../model/todo-selection-context';
import { useBulkTodoActions } from '../model/use-bulk-todo-actions';

interface TodoActionsBarProps {
  visibleTodos: Todo[];
  onRefresh(): void;
}

export function TodoActionsBar({ visibleTodos, onRefresh }: TodoActionsBarProps) {
  const { selectedIds, exitSelectionMode, selectIds, clearSelection } = useTodoSelection();

  const confirm = useConfirm();
  const { setSelectedCompleted, deleteSelected, clearCompletedAll } = useBulkTodoActions();

  const selectedTodos = visibleTodos.filter((t) => selectedIds.includes(t.id));

  return (
    <div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50/70 px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (selectedIds.length > 0) {
              clearSelection();
            } else {
              selectIds(visibleTodos.map((t) => t.id));
            }
          }}
          disabled={visibleTodos.length === 0}
          className="min-w-[125px]"
        >
          {selectedIds.length > 0 ? 'Clear selection' : 'Select all'}
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

        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            const ok = await confirm({
              title: 'Clear completed todos?',
              description: 'All completed todos will be permanently removed.',
            });
            if (!ok) return;
            await clearCompletedAll();
          }}
        >
          Clear completed
        </Button>

        <Button variant="ghost" size="sm" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
