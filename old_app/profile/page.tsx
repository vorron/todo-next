// app/profile/page.tsx
'use client';

import { useGetCurrentUserQuery, useGetUsersQuery } from '@/lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';

export default function ProfilePage() {
  const selectedUserId = useSelector(
    (state: RootState) => state.todo.selectedUserId
  );
  
  const { data: users } = useGetUsersQuery();
  const { data: currentUser } = useGetCurrentUserQuery(selectedUserId ?? '', {
    skip: !selectedUserId,
  });

  const userStats = {
    totalTodos: 12, // В реальном приложении получали бы из API
    completedTodos: 8,
    pendingTodos: 4,
  };

  if (!selectedUserId) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Profile</h1>
          <p className="text-gray-600 mb-4">Please select a user to view profile</p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Select User
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <Link
            href="/"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Todos
          </Link>
        </div>

        {currentUser && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info */}
            <div className="md:col-span-2">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Personal Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg text-gray-900">{currentUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Username</label>
                    <p className="text-lg text-gray-900">@{currentUser.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-lg text-gray-900 font-mono">{currentUser.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Todo Stats</h2>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {userStats.totalTodos}
                  </div>
                  <div className="text-sm text-gray-600">Total Todos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {userStats.completedTodos}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {userStats.pendingTodos}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Available Users */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available Users ({users?.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {users?.map((user) => (
              <div
                key={user.id}
                className={`p-4 border rounded-lg ${
                  user.id === selectedUserId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">@{user.username}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}