// components/auth/UserSelector.tsx
'use client';

import { useGetUsersQuery } from '@/lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '@/lib/slices/todoSlice';
import { RootState } from '@/lib/store';

export default function UserSelector() {
  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const dispatch = useDispatch();
  const selectedUserId = useSelector(
    (state: RootState) => state.todo.selectedUserId
  );

  const handleUserSelect = (userId: string) => {
    dispatch(setSelectedUser(userId));
  };

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

  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Select User</h2>
        {selectedUser && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Current:</span>
            <span className="font-medium text-blue-600">{selectedUser.name}</span>
            <button
              onClick={() => dispatch(setSelectedUser(''))}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {!selectedUserId ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user.id)}
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">@{user.username}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-green-600 font-medium">
            ✓ Logged in as {selectedUser?.name}
          </p>
        </div>
      )}
    </div>
  );
}