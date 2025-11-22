import { createSelector } from "@reduxjs/toolkit";
import { todoApi } from "../api/todo-api";
import type { FilterType, TodoStats } from "./types";

/**
 * Базовые селекторы
 */
export const selectAllTodos = (userId?: string) =>
  todoApi.endpoints.getTodos.select(userId ? { userId } : undefined);

export const selectTodoById = (id: string) =>
  todoApi.endpoints.getTodoById.select(id);

/**
 * Фильтрация todos
 */
export const selectFilteredTodos = (
  userId: string | undefined,
  filter: FilterType
) =>
  createSelector([selectAllTodos(userId)], (todosResult) => {
    if (!todosResult.data) return [];

    switch (filter) {
      case "active":
        return todosResult.data.filter((todo) => !todo.completed);
      case "completed":
        return todosResult.data.filter((todo) => todo.completed);
      default:
        return todosResult.data;
    }
  });

/**
 * Сортировка todos
 */
export const selectSortedTodos = (
  userId: string | undefined,
  sortBy: "date" | "priority" | "alphabetical" = "date"
) =>
  createSelector([selectAllTodos(userId)], (todosResult) => {
    if (!todosResult.data) return [];

    const todos = [...todosResult.data];

    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return todos.sort((a, b) => {
          const aPriority = a.priority || "medium";
          const bPriority = b.priority || "medium";
          return priorityOrder[aPriority] - priorityOrder[bPriority];
        });

      case "alphabetical":
        return todos.sort((a, b) => a.text.localeCompare(b.text));

      case "date":
      default:
        return todos.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

/**
 * Статистика по todos
 */
export const selectTodoStats = (userId?: string) =>
  createSelector([selectAllTodos(userId)], (todosResult): TodoStats => {
    if (!todosResult.data) {
      return {
        total: 0,
        completed: 0,
        active: 0,
        byPriority: { low: 0, medium: 0, high: 0 },
      };
    }

    const todos = todosResult.data;

    return {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      active: todos.filter((t) => !t.completed).length,
      byPriority: {
        low: todos.filter((t) => (t.priority || "medium") === "low").length,
        medium: todos.filter((t) => (t.priority || "medium") === "medium")
          .length,
        high: todos.filter((t) => (t.priority || "medium") === "high").length,
      },
    };
  });

/**
 * Поиск по todos
 */
export const selectSearchedTodos = (
  userId: string | undefined,
  searchTerm: string
) =>
  createSelector([selectAllTodos(userId)], (todosResult) => {
    if (!todosResult.data || !searchTerm) return todosResult.data || [];

    const term = searchTerm.toLowerCase();
    return todosResult.data.filter((todo) =>
      todo.text.toLowerCase().includes(term)
    );
  });
