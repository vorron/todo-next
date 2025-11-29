'use client';

import { useAuth } from '@/features/auth';
import { UserMenu, LogoutButton } from '@/features/auth';
import { useRouter, usePathname } from 'next/navigation';
import { ROUTES, navigation } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';

export function Navbar() {
    const { isAuthenticated, session } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    if (!isAuthenticated) return null;

    const isActiveRoute = (href: string) => {
        return pathname === href || (href !== ROUTES.HOME && pathname.startsWith(href));
    };

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg supports-backdrop-blur:bg-white/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div
                        className="flex items-center space-x-2 cursor-pointer group"
                        onClick={() => router.push(ROUTES.TODOS)}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                            <span className="text-sm font-bold text-white">✓</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            TodoApp
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navigation.main
                            .map((item) => (
                                <button
                                    key={item.href}
                                    onClick={() => router.push(item.href)}
                                    className={cn(
                                        'text-sm font-medium transition-colors relative',
                                        isActiveRoute(item.href)
                                            ? 'text-blue-600'
                                            : 'text-gray-700 hover:text-blue-600'
                                    )}
                                >
                                    {item.name}
                                    {isActiveRoute(item.href) && (
                                        <span className="absolute -bottom-6 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                                    )}
                                </button>
                            ))}
                    </div>

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        {/* User info */}
                        <div className="hidden sm:flex items-center space-x-3">
                            <span className="text-sm text-gray-600">
                                Welcome, <span className="font-semibold">{session?.name}</span>
                            </span>
                        </div>

                        {/* User Menu */}
                        <UserMenu />

                        {/* Logout Button - visible on desktop */}
                        <div className="hidden lg:block">
                            <LogoutButton variant="ghost" size="sm" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}