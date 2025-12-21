import { type Todo } from './todo-schema';

export type {
  Todo,
  CreateTodoDto,
  UpdateTodoDto,
  TodoFilter,
  TodoPriorityType,
} from './todo-schema';
export { TodoPriority } from './todo-schema';

/**
 * UI типы
 */
export const FILTER_VALUES = ['all', 'active', 'completed'] as const;

export type FilterType = (typeof FILTER_VALUES)[number];

export const SORT_VALUES = ['date', 'priority', 'alphabetical'] as const;

export type TodoSortBy = (typeof SORT_VALUES)[number];

export interface TodoListItem extends Todo {
  isEditing?: boolean;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}
