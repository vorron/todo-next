import { type LoginDto, loginSchema } from "@/features/auth/model/auth-schema";
import { ZodError } from "zod";

/**
 * Валидация формы логина
 */
export function validateLoginForm(data: LoginDto): {
  valid: boolean;
  errors: Record<string, string>;
} {
  try {
    loginSchema.parse(data);
    return { valid: true, errors: {} };
  } catch (error) {
    const errors: Record<string, string> = {};

    if (error instanceof ZodError) {
      error.issues.forEach((issue) => {
        // Проверяем, что путь существует и первый элемент - строка
        if (issue.path.length > 0 && typeof issue.path[0] === "string") {
          errors[issue.path[0]] = issue.message;
        }
      });
    }

    return { valid: false, errors };
  }
}

/**
 * Mock проверка учетных данных
 * В реальном приложении будет API запрос
 */
export async function validateCredentials(
  username: string,
  password?: string
): Promise<boolean> {
  // Для mock версии принимаем любой username длиной >= 3
  await new Promise((resolve) => setTimeout(resolve, 500)); // Имитация задержки сети
  console.log(password);
  return username.length >= 3;
}
