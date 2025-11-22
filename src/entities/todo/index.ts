// API
export {
  todoApi,
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoMutation,
  useToggleAllTodosMutation,
  useClearCompletedMutation,
} from "./api/todo-api";

// Types
export type {
  Todo,
  CreateTodoDto,
  UpdateTodoDto,
  TodoFilter,
  FilterType,
  TodoStats,
} from "./model/types";
export { TodoPriority } from "./model/todo-schema";

// Schemas
export {
  todoSchema,
  todosSchema,
  createTodoSchema,
  updateTodoSchema,
} from "./model/todo-schema";

// Constants
export {
  TODO_PRIORITY_LABELS,
  TODO_PRIORITY_COLORS,
  FILTER_OPTIONS,
} from "./model/constants";

// Selectors
export {
  selectAllTodos,
  selectTodoById,
  selectFilteredTodos,
  selectSortedTodos,
  selectTodoStats,
  selectSearchedTodos,
} from "./model/selectors";

// Helpers
export {
  isTodoOverdue,
  getPriorityClassName,
  formatDueDate,
  calculateCompletionPercentage,
  groupTodosByDate,
  filterByTags,
  getUniqueTags,
} from "./lib/todo-helpers";
