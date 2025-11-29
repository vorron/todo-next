import { z } from "zod";

/**
 * Zod схема для Todo
 */
export const todoSchema = z.object({
  id: z.string().min(1, "Todo ID is required"),
  text: z
    .string()
    .min(1, "Todo text is required")
    .max(500, "Todo text must be at most 500 characters")
    .trim(),
  completed: z.boolean().default(false),
  userId: z.string().min(1, "User ID is required"),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  createdAt: z.string().optional().default(() => new Date().toISOString()),
  updatedAt: z.string().optional().default(() => new Date().toISOString()),
});

// Схема для массива todos
export const todosSchema = z.array(todoSchema);

// Схема для создания todo
export const createTodoSchema = todoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Схема для обновления todo
export const updateTodoSchema = todoSchema
  .partial()
  .required({ id: true })
  .refine(
    (data) => {
      if (data.text !== undefined && data.text.trim().length === 0) {
        return false;
      }
      return true;
    },
    {
      message: "Todo text cannot be empty",
      path: ["text"],
    }
  );

// Схема для фильтров
export const todoFilterSchema = z.object({
  userId: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Схема для query параметров
export const todoFilterQuerySchema = z.object({
  userId: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  search: z.string().optional(),
  tags: z.string().optional().transform(val => val ? val.split(',') : undefined),
});

/**
 * TypeScript типы
 */
export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoDto = z.infer<typeof createTodoSchema>;
export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;
export type TodoFilter = z.infer<typeof todoFilterSchema>;
export type TodoFilterQuery = z.infer<typeof todoFilterQuerySchema>;

// Enum для приоритетов (для удобства использования)
export const TodoPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type TodoPriorityType = (typeof TodoPriority)[keyof typeof TodoPriority];