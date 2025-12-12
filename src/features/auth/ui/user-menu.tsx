'use client';

import Link from 'next/link';
import { useAuth } from '../model/use-auth';
import { getUserInitials, getAvatarColor } from '@/entities/user';
import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui';

export function UserMenu() {
  const { session, logout } = useAuth();

  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="User menu"
        >
          <div
            className={cn(
              'h-9 w-9 rounded-full flex items-center justify-center text-white font-semibold border border-white shadow-sm',
              getAvatarColor(session.name),
            )}
          >
            {getUserInitials({
              id: session.userId,
              username: session.username,
              name: session.name,
            })}
          </div>
          <span className="hidden sm:inline-flex max-w-40 truncate text-sm font-medium text-gray-900">
            {session.name}
          </span>
          <svg
            className="hidden sm:block h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-gray-900 truncate">{session.name}</p>
            <p className="text-xs text-gray-500 truncate">@{session.username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={ROUTES.PROFILE}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.SETTINGS}>Settings</Link>
        </DropdownMenuItem>

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
  );
}
