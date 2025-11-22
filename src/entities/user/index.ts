// API
export {
  userApi,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "./api/user-api";

// Types
export type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserWithStats,
  UserListItem,
} from "./model/types";

// Schemas
export {
  userSchema,
  usersSchema,
  createUserSchema,
  updateUserSchema,
} from "./model/user-schema";

// Selectors
export {
  selectAllUsers,
  selectUserById,
  selectSortedUsers,
  selectUsersBySearch,
} from "./model/selectors";

// Helpers
export {
  getUserInitials,
  getUserDisplayName,
  isValidUsername,
  getAvatarColor,
} from "./lib/user-helpers";

// UI будет экспортироваться отсюда же (создадим позже)
