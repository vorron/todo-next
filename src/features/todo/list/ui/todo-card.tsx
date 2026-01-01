import { memo } from 'react';

import {
  formatDueDate,
  getPriorityClassName,
  isTodoOverdue,
} from '@/entities/todo/lib/todo-helpers';
import { TODO_PRIORITY_COLORS } from '@/entities/todo/model/constants';
import { selectCompactView } from '@/features/settings/model/selectors';
import { useAppSelector } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui';
import { ActionBar } from '@/shared/ui/action-bar';
import { Checkbox } from '@/shared/ui/checkbox';

import type { Todo } from '@/entities/todo/model/types';
import type { ConfirmFn } from '@/shared/ui/dialog/confirm-dialog-provider';

interface TodoCardProps {
  todo: Todo;
  selected?: boolean;
  confirm?: ConfirmFn;
  onToggleComplete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onClick: (todo: Todo) => void;
  onSelectToggle: (id: string) => void;
}

export const TodoCard = memo(function TodoCard({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
  onClick,
  confirm,
  selected,
  onSelectToggle,
}: TodoCardProps) {
  const compactView = useAppSelector(selectCompactView);
  return (
    <Card
      className={cn(
        'transition-all hover:shadow-sm border border-slate-200 rounded-lg',
        todo.completed && 'opacity-70',
        getPriorityClassName(todo.priority),
        compactView ? 'p-3' : 'p-4',
      )}
    >
      <CardContent
        className={cn('p-0 flex items-start gap-3', compactView ? 'space-y-2' : 'space-y-3')}
      >
        {/* Selection checkbox (always visible, left column) */}
        <Checkbox
          checked={selected}
          onChange={(e) => {
            e.stopPropagation();
            onSelectToggle?.(todo.id);
          }}
          title={selected ? 'Убрать из выбранных' : 'Выбрать для массовых действий'}
        />

        {/* Content + actions */}
        <div
          className="flex items-start gap-3 flex-1 min-w-0 justify-between"
          onClick={() => onClick(todo)}
        >
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                'text-gray-900 wrap-break-word cursor-pointer hover:text-blue-600',
                todo.completed && 'line-through text-gray-500',
              )}
            >
              {todo.text}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Priority badge */}
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  TODO_PRIORITY_COLORS[todo.priority].bg,
                  TODO_PRIORITY_COLORS[todo.priority].text,
                )}
              >
                {todo.priority}
              </span>

              {/* Due date */}
              {todo.dueDate && (
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    isTodoOverdue(todo) ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600',
                  )}
                >
                  {formatDueDate(todo.dueDate)}
                </span>
              )}

              {/* Tags */}
              {todo.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <ActionBar
            align="end"
            confirmDialog={confirm}
            actions={[
              {
                key: 'toggle-complete',
                title: todo.completed ? 'Сделать активной' : 'Отметить выполненность',
                icon: todo.completed ? 'Undo2' : 'Check',
                onClick: () => onToggleComplete(todo),
                variant: 'default',
              },
              {
                key: 'edit',
                title: todo.completed
                  ? 'Редактировать недоступно для выполненных'
                  : 'Редактировать',
                icon: 'Pencil',
                onClick: () => onEdit(todo),
                disabled: todo.completed,
                variant: 'muted',
                className: cn(todo.completed && 'text-gray-300 hover:text-gray-300'),
              },
              {
                key: 'delete',
                title: 'Удалить',
                icon: 'Trash2',
                confirm: {
                  title: 'Delete Todo?',
                  description: `Are you sure you want to delete "${todo.text}"? This action cannot be undone.`,
                },
                onClick: () => onDelete(todo),
                variant: 'danger',
              },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
});
