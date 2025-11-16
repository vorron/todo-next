'use client';

import { useGetUsersQuery } from '@/lib/api';
import { useTodo } from '@/lib/hooks/useTodo';
import { useRouter } from 'next/navigation';

export default function UserSelector() {
  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const { setSelectedUser } = useTodo()
  const router = useRouter()

  function handleSetSelectedUser(userId: string) {
    setSelectedUser(userId);
    router.push('todos')
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading users
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => handleSetSelectedUser(user.id)}
          className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <div className="font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">@{user.username}</div>
        </button>
      ))}
    </div>
  );
}