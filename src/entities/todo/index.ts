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

// Form Schemas (новые унифицированные схемы)
export {
  todoFormBaseSchema,
  createTodoFormSchema,
  editTodoFormSchema,
  type TodoFormBaseData,
  type CreateTodoFormData,
  type EditTodoFormData,
  parseTagsInput,
  formatTagsForInput,
  toDateInputValue,
} from './model/todo-form-schemas';

// Legacy schema (удален - используем новые унифицированные схемы)

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
