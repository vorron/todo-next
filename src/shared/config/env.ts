import { z } from 'zod';

/**
 * Environment variables schema with Zod validation
 * Provides type-safe access to env vars with runtime validation
 */
const envSchema = z.object({
  // Public env vars (available on client)
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL'),
  NEXT_PUBLIC_IMAGE_HOSTNAMES: z.string().default(''),

  // Server-only env vars
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NESTJS_API_URL: z.string().url('NESTJS_API_URL must be a valid URL').optional(),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL').optional(),
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required').optional(),
});

/**
 * Parse and validate environment variables
 * Throws descriptive error if validation fails
 */
function parseEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_IMAGE_HOSTNAMES: process.env.NEXT_PUBLIC_IMAGE_HOSTNAMES,
    NODE_ENV: process.env.NODE_ENV,
    NESTJS_API_URL: process.env.NESTJS_API_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
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
  NESTJS_API_URL: parsedEnv.NESTJS_API_URL || parsedEnv.NEXT_PUBLIC_API_URL,
  IMAGE_HOSTNAMES: parsedEnv.NEXT_PUBLIC_IMAGE_HOSTNAMES.split(',')
    .map((v) => v.trim())
    .filter(Boolean),
  NODE_ENV: parsedEnv.NODE_ENV,
  IS_PRODUCTION: parsedEnv.NODE_ENV === 'production',
  IS_DEVELOPMENT: parsedEnv.NODE_ENV === 'development',
  IS_TEST: parsedEnv.NODE_ENV === 'test',
  NEXTAUTH_URL: parsedEnv.NEXTAUTH_URL,
  NEXTAUTH_SECRET: parsedEnv.NEXTAUTH_SECRET,
} as const;

/**
 * Type for environment configuration
 */
export type Env = typeof env;
