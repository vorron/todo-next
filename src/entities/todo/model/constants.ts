import { TodoPriority } from './todo-schema';

/**
 * Константы для работы с Todo
 */
export const TODO_PRIORITY_LABELS = {
  [TodoPriority.LOW]: 'Low Priority',
  [TodoPriority.MEDIUM]: 'Medium Priority',
  [TodoPriority.HIGH]: 'High Priority',
} as const;

export const TODO_PRIORITY_COLORS = {
  [TodoPriority.LOW]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    dot: 'bg-gray-800',
  },
  [TodoPriority.MEDIUM]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    dot: 'bg-blue-800',
  },
  [TodoPriority.HIGH]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    dot: 'bg-red-800',
  },
} as const;
