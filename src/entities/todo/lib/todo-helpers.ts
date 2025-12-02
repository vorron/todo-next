import type { Todo, TodoStats } from '../model/types';
import { TodoPriority } from '../model/todo-schema';

/**
 * Проверка просрочен ли todo
 */
export function isTodoOverdue(todo: Todo): boolean {
  if (!todo.dueDate || todo.completed) return false;
  return new Date(todo.dueDate) < new Date();
}

/**
 * Получить класс стиля для приоритета
 */
export function getPriorityClassName(priority?: string): string {
  switch (priority) {
    case TodoPriority.HIGH:
      return 'border-l-4 border-red-500';
    case TodoPriority.MEDIUM:
      return 'border-l-4 border-blue-500';
    case TodoPriority.LOW:
      return 'border-l-4 border-gray-500';
    default:
      return '';
  }
}

/**
 * Форматирование даты выполнения
 */
export function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `In ${diffDays} days`;

  return date.toLocaleDateString();
}

/**
 * Подсчет процента выполнения
 */
export function calculateCompletionPercentage(stats: TodoStats): number {
  if (stats.total === 0) return 0;
  return Math.round((stats.completed / stats.total) * 100);
}

/**
 * Группировка todos по дате
 */
export function groupTodosByDate(todos: Todo[]): Record<string, Todo[]> {
  const groups: Record<string, Todo[]> = {
    today: [],
    week: [],
    later: [],
    overdue: [],
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekEnd = new Date(todayStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  todos.forEach((todo) => {
    if (!todo.dueDate) {
      groups.later.push(todo);
      return;
    }

    const dueDate = new Date(todo.dueDate);

    if (dueDate < todayStart && !todo.completed) {
      groups.overdue.push(todo);
    } else if (dueDate < new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)) {
      groups.today.push(todo);
    } else if (dueDate < weekEnd) {
      groups.week.push(todo);
    } else {
      groups.later.push(todo);
    }
  });

  return groups;
}

/**
 * Фильтрация по тегам
 */
export function filterByTags(todos: Todo[], tags: string[]): Todo[] {
  if (tags.length === 0) return todos;

  return todos.filter((todo) => tags.every((tag) => todo.tags?.includes(tag)));
}

/**
 * Получение уникальных тегов
 */
export function getUniqueTags(todos: Todo[]): string[] {
  const allTags = todos.flatMap((todo) => todo.tags || []);
  return Array.from(new Set(allTags)).sort();
}
