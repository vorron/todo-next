import { createSelector } from '@reduxjs/toolkit';

import { userApi } from '../api/user-api';

/**
 * Селекторы для работы с пользователями
 */

// Базовый селектор всех пользователей
export const selectAllUsers = userApi.endpoints.getUsers.select();

// Селектор для получения пользователя по ID
export const selectUserById = (userId: string) => userApi.endpoints.getUserById.select(userId);

// Мемоизированный селектор для сортировки пользователей
export const selectSortedUsers = createSelector([selectAllUsers], (usersResult) => {
  if (!usersResult.data) return [];

  return [...usersResult.data].sort((a, b) => a.name.localeCompare(b.name));
});

// Селектор для поиска пользователей
export const selectUsersBySearch = (searchTerm: string) =>
  createSelector([selectAllUsers], (usersResult) => {
    if (!usersResult.data || !searchTerm) return usersResult.data || [];

    const term = searchTerm.toLowerCase();
    return usersResult.data.filter(
      (user) =>
        user.name.toLowerCase().includes(term) || user.username.toLowerCase().includes(term),
    );
  });
