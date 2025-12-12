'use client';

import { useAuth } from '@/features/auth';
import { UserMenu, LogoutButton } from '@/features/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES, navigation } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { HeaderBreadcrumbs } from './breadcrumbs';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  const isActiveRoute = (href: string) => {
    return pathname === href || (href !== ROUTES.HOME && pathname.startsWith(href));
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg supports-backdrop-blur:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3">
          {/* Logo */}
          <Link href={ROUTES.TODOS} className="flex items-center gap-2 cursor-pointer group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600">
              <span className="text-sm font-bold text-white">✓</span>
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              TodoApp
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center rounded-full bg-gray-100 p-1">
            {navigation.main
              .filter((item) => !item.auth || isAuthenticated)
              .map((item) => {
                const active = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60',
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
          </div>

          {/* User Section */}
          <div className="ml-auto flex items-center gap-3">
            <HeaderBreadcrumbs />

            <div className="flex items-center gap-2">
              {/* User Menu */}
              <UserMenu />

              {/* Logout Button - visible on desktop */}
              <div className="hidden lg:block">
                <LogoutButton variant="ghost" size="sm" />
              </div>

              {/* Mobile menu */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" aria-label="Open menu">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 6h16" />
                        <path d="M4 12h16" />
                        <path d="M4 18h16" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {navigation.main
                      .filter((item) => !item.auth || isAuthenticated)
                      .map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link href={item.href}>{item.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
