import { useCallback } from "react";
import { useDeleteTodoMutation } from "@/entities/todo";
import { handleApiError, handleApiSuccess } from "@/shared/lib/errors";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function useDeleteTodo() {
  const [deleteTodoMutation, { isLoading }] = useDeleteTodoMutation();

  const deleteTodo = useCallback(
    async (id: string) => {
      try {
        await deleteTodoMutation(id).unwrap();
        handleApiSuccess("Todo deleted successfully");
      } catch (error: unknown) {
        handleApiError(error as FetchBaseQueryError, "Failed to delete todo");
        throw error;
      }
    },
    [deleteTodoMutation],
  );

  return {
    deleteTodo,
    isLoading,
  };
}
