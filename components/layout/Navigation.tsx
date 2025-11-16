// components/layout/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useTodo } from '@/lib/hooks/useTodo';
import { useGetCurrentUserQuery } from '@/lib/api';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Todos', href: '/todos' },
  { name: 'Profile', href: '/profile' },
  { name: 'About', href: '/about' },
];

export default function Navigation() {
  const pathname = usePathname();

  const { selectedUserId } = useTodo()

  const { data: currentUser } = useGetCurrentUserQuery(selectedUserId ?? '', {
    skip: !selectedUserId,
  });

  const { clearSelectedUser, } = useTodo()
  const router = useRouter()

  const handleLogout = () => {
    clearSelectedUser()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900">
              TodoApp
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === item.href
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {selectedUserId ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-600">{currentUser?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No User Selected</div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}