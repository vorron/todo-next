import { Card, CardContent } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import type { Todo } from "../../../entities/todo/model/types";
import {
  getPriorityClassName,
  isTodoOverdue,
  formatDueDate,
} from "../../../entities/todo/lib/todo-helpers";
import { TODO_PRIORITY_COLORS } from "../../../entities/todo/model/constants";

interface TodoCardProps {
  todo: Todo;
  onToggle?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  variant?: "default" | "compact";
  showPriority?: boolean;
  showDueDate?: boolean;
}

export function TodoCard({
  todo,
  onToggle,
  onDelete,
  onClick,
  variant = "default",
  showPriority = true,
  showDueDate = true,
}: TodoCardProps) {
  const isOverdue = isTodoOverdue(todo);
  const priority = todo.priority || "medium";

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        todo.completed && "opacity-60",
        getPriorityClassName(priority),
        variant === "compact" ? "p-3" : "p-4",
      )}
    >
      <CardContent
        className={cn("p-0", variant === "compact" ? "space-y-2" : "space-y-3")}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
            className="flex-shrink-0 mt-1"
          >
            <div
              className={cn(
                "h-5 w-5 rounded border-2 flex items-center justify-center transition-colors",
                todo.completed
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300 hover:border-blue-500",
              )}
            >
              {todo.completed && (
                <svg
                  className="h-3 w-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M10 3L4.5 8.5 2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              )}
            </div>
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0" onClick={onClick}>
            <p
              className={cn(
                "text-gray-900 break-words cursor-pointer hover:text-blue-600",
                todo.completed && "line-through text-gray-500",
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
                    "text-xs px-2 py-0.5 rounded-full",
                    TODO_PRIORITY_COLORS[priority].bg,
                    TODO_PRIORITY_COLORS[priority].text,
                  )}
                >
                  {priority}
                </span>
              )}

              {/* Due date */}
              {showDueDate && todo.dueDate && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    isOverdue
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-600",
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

          {/* Delete button */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
