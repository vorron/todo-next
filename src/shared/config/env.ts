/**
 * Валидация и типизация environment variables
 */

const requiredEnvVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
} as const;

// Проверка наличия обязательных переменных
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  API_URL: requiredEnvVars.NEXT_PUBLIC_API_URL,
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
} as const;
