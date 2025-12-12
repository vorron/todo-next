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
export type FilterType = 'all' | 'active' | 'completed';

export type TodoSortBy = 'date' | 'priority' | 'alphabetical';

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
