// API
export { todoApi } from './api/todo-api';

// Types
export type {
  Todo,
  CreateTodoDto,
  UpdateTodoDto,
  TodoFilter,
  FilterType,
  TodoSortBy,
  TodoStats,
} from './model/types';
export { FILTER_VALUES, SORT_VALUES } from './model/types';
export { TodoPriority } from './model/todo-schema';

// Schemas
export { todoSchema, todosSchema, createTodoSchema, updateTodoSchema } from './model/todo-schema';
export { createTodoFormSchema, type CreateTodoFormData } from './model/create-todo-schema';

// Constants
export { TODO_PRIORITY_LABELS, TODO_PRIORITY_COLORS } from './model/constants';

// Selectors
export {
  selectAllTodos,
  selectTodoById,
  selectFilteredTodos,
  selectSortedTodos,
  selectTodoStats,
  selectSearchedTodos,
} from './model/selectors';

// Helpers
export {
  isTodoOverdue,
  getPriorityClassName,
  formatDueDate,
  calculateCompletionPercentage,
  groupTodosByDate,
  filterByTags,
  getUniqueTags,
} from './lib/todo-helpers';
