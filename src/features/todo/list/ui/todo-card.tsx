import { Card, CardContent } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import type { Todo } from '@/entities/todo/model/types';
import {
  getPriorityClassName,
  isTodoOverdue,
  formatDueDate,
} from '@/entities/todo/lib/todo-helpers';
import { TODO_PRIORITY_COLORS } from '@/entities/todo/model/constants';
import { ActionBar } from '@/shared/ui/action-bar';
import { Checkbox } from '@/shared/ui/checkbox';

interface TodoCardProps {
  todo: Todo;
  onToggleComplete?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClick?: () => void;
  variant?: 'default' | 'compact';
  showPriority?: boolean;
  showDueDate?: boolean;
  selected?: boolean;
  onSelectToggle?: () => void;
}

export function TodoCard({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
  onClick,
  variant = 'default',
  showPriority = true,
  showDueDate = true,
  selected,
  onSelectToggle,
}: TodoCardProps) {
  const isOverdue = isTodoOverdue(todo);

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-sm border border-slate-200 rounded-lg',
        todo.completed && 'opacity-70',
        getPriorityClassName(todo.priority),
        variant === 'compact' ? 'p-3' : 'p-4',
      )}
    >
      <CardContent
        className={cn(
          'p-0 flex items-start gap-3',
          variant === 'compact' ? 'space-y-2' : 'space-y-3',
        )}
      >
        {/* Selection checkbox (always visible, left column) */}
        <Checkbox
          checked={selected}
          onChange={(e) => {
            e.stopPropagation();
            onSelectToggle?.();
          }}
          title={selected ? 'Убрать из выбранных' : 'Выбрать для массовых действий'}
        />

        {/* Content + actions */}
        <div className="flex items-start gap-3 flex-1 min-w-0 justify-between" onClick={onClick}>
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
              {showPriority && (
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    TODO_PRIORITY_COLORS[todo.priority].bg,
                    TODO_PRIORITY_COLORS[todo.priority].text,
                  )}
                >
                  {todo.priority}
                </span>
              )}

              {/* Due date */}
              {showDueDate && todo.dueDate && (
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    isOverdue ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600',
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
            actions={[
              {
                key: 'toggle-complete',
                title: todo.completed ? 'Сделать активной' : 'Отметить выполненность',
                icon: todo.completed ? 'Undo2' : 'Check',
                onClick: onToggleComplete,
                variant: 'default',
              },
              {
                key: 'edit',
                title: todo.completed
                  ? 'Редактировать недоступно для выполненных'
                  : 'Редактировать',
                icon: 'Pencil',
                onClick: onEdit,
                disabled: todo.completed,
                variant: 'muted',
                className: cn(todo.completed && 'text-gray-300 hover:text-gray-300'),
              },
              {
                key: 'delete',
                title: 'Удалить',
                icon: 'Trash2',
                onClick: onDelete,
                variant: 'danger',
              },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
