import { TODO_PRIORITY_COLORS, TODO_PRIORITY_LABELS } from '@/entities/todo';
import { cn } from '@/shared/lib/utils';

import type { TodoPriorityType } from '@/entities/todo/model/types';

interface TodoPriorityBadgeProps {
  priority: TodoPriorityType;
  className?: string;
}

export function TodoPriorityBadge({ priority, className }: TodoPriorityBadgeProps) {
  const palette = TODO_PRIORITY_COLORS[priority];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium border',
        palette.bg,
        palette.text,
        palette.border,
        className,
      )}
    >
      <span className={cn('h-2.5 w-2.5 rounded-full', palette.dot)} aria-hidden />
      Priority: {TODO_PRIORITY_LABELS[priority]}
    </span>
  );
}
