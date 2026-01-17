import { handlers } from '@/features/auth/lib/auth';

/**
 * NextAuth API Route Handler
 *
 * Этот файл обрабатывает все запросы к /api/auth/* включая:
 * - /api/auth/signin - логин
 * - /api/auth/signout - логаут
 * - /api/auth/session - получение сессии
 * - /api/auth/callback - OAuth callbacks
 *
 * Работает с Next.js App Router и поддерживает:
 * - Edge runtime для максимальной производительности
 * - JWT стратегию для stateless сессий
 * - Server-side auth checks в Server Components
 */

export const { GET, POST } = handlers;
