import { z } from 'zod';

/**
 * Environment variables schema with Zod validation
 * Provides type-safe access to env vars with runtime validation
 */
const envSchema = z.object({
  // Public env vars (available on client)
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL'),

  // Server-only env vars
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Parse and validate environment variables
 * Throws descriptive error if validation fails
 */
function parseEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    const errorMessage = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`❌ Invalid environment variables:\n${errorMessage}`);
  }

  return parsed.data;
}

const parsedEnv = parseEnv();

/**
 * Type-safe environment configuration
 */
export const env = {
  API_URL: parsedEnv.NEXT_PUBLIC_API_URL,
  NODE_ENV: parsedEnv.NODE_ENV,
  IS_PRODUCTION: parsedEnv.NODE_ENV === 'production',
  IS_DEVELOPMENT: parsedEnv.NODE_ENV === 'development',
  IS_TEST: parsedEnv.NODE_ENV === 'test',
} as const;

/**
 * Type for environment configuration
 */
export type Env = typeof env;
