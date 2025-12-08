import { type User } from './user-schema';

export type { User, CreateUserDto, UpdateUserDto } from './user-schema';

/**
 * Дополнительные типы для UI состояний
 */
export interface UserWithStats extends User {
  todosCount: number;
  completedTodosCount: number;
}

export interface UserListItem {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isSelected?: boolean;
}

export interface UserSelectOption {
  value: string;
  label: string;
}
