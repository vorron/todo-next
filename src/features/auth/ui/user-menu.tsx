'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../model/use-auth';
import { getUserInitials, getAvatarColor } from '@/entities/user';
import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { LogoutButton } from './logout-button';

export function UserMenu() {
    const { session } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!session) return null;

    return (
        <div className="relative" ref={menuRef}>
            {/* Avatar button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                aria-label="User menu"
            >
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {session.name}
                    </span>
                    <span className="text-xs text-gray-500">
                        @{session.username}
                    </span>
                </div>
                <div
                    className={cn(
                        'h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white shadow-sm',
                        getAvatarColor(session.name)
                    )}
                >
                    {getUserInitials({ id: session.userId, username: session.username, name: session.name })}
                </div>
                <svg
                    className={cn(
                        'h-4 w-4 text-gray-400 transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in zoom-in duration-200">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{session.name}</p>
                        <p className="text-xs text-gray-500 truncate">@{session.username}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                        <Link
                            href={ROUTES.TODOS}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            My Todos
                        </Link>

                        <Link
                            href={ROUTES.PROFILE}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            Profile Settings
                        </Link>
                    </div>

                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Logout in dropdown - for mobile */}
                    <div className="px-4 py-2 lg:hidden">
                        <LogoutButton
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            withConfirmation={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}