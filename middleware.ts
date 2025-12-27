import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

/**
 * Middleware для защиты роутов
 * В mock версии проверяет наличие session в cookie
 * В production версии будет проверять JWT токен
 */

// const PUBLIC_ROUTES = ['/', '/login', '/about'];
// const AUTH_ROUTES = ['/login'];

// export function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;

//     // Проверяем наличие сессии (mock - просто проверка localStorage через cookie)
//     const hasSession = request.cookies.has('app_session_exists');

//     // Если пользователь авторизован и пытается зайти на login
//     if (hasSession && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
//         return NextResponse.redirect(new URL('/todos', request.url));
//     }

//     // Если пользователь не авторизован и пытается зайти на приватную страницу
//     if (!hasSession && !PUBLIC_ROUTES.some((route) => pathname === route)) {
//         const loginUrl = new URL('/login', request.url);
//         loginUrl.searchParams.set('callbackUrl', pathname);
//         return NextResponse.redirect(loginUrl);
//     }

//     return NextResponse.next();
// }

// middleware.ts

//import { ROUTES } from '@/lib/routes';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Логирование, аналитика, но НЕ защита маршрутов
  if (process.env.NODE_ENV === 'development') {
    console.log(`Request to: ${path}`);
  }

  // Защита маршрутов происходит в layout'ах, а не здесь
  return NextResponse.next();
}

// Матчим ВСЕ маршруты, кроме статических файлов
// export const config = {
//   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
// };

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
