import type { User } from '../model/types';

/**
 * Получить инициалы пользователя
 */
export function getUserInitials(user: User): string {
  const names = user.name.split(' ');
  const firstName = names[0];
  const lastName = names[1];

  if (names.length >= 2 && firstName && lastName) {
    return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  }
  return user.name.substring(0, 2).toUpperCase();
}

/**
 * Получить полное отображаемое имя
 */
export function getUserDisplayName(user: User): string {
  return `${user.name} (@${user.username})`;
}

/**
 * Валидация username
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

/**
 * Генерация цвета аватара по имени
 */
const AVATAR_COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
] as const;

export function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index] ?? 'bg-gray-500';
}
