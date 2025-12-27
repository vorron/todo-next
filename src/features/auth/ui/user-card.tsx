import Image from 'next/image';

import { getAvatarColor, getUserInitials, type User } from '@/entities/user';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui';

interface UserCardProps {
  user: User;
  isSelected?: boolean;
  onClick?: () => void;
  showEmail?: boolean;
}

export function UserCard({ user, isSelected, onClick, showEmail }: UserCardProps) {
  const isExternalAvatar = Boolean(
    user.avatar?.startsWith('http://') || user.avatar?.startsWith('https://'),
  );

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-blue-500 bg-blue-50',
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full text-white font-semibold text-lg',
              user.avatar ? '' : getAvatarColor(user.name),
            )}
          >
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                unoptimized={isExternalAvatar}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              getUserInitials(user)
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
            <p className="text-sm text-gray-500 truncate">@{user.username}</p>
            {showEmail && user.email && (
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            )}
          </div>

          {/* Selected indicator */}
          {isSelected && (
            <div className="shrink-0">
              <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
