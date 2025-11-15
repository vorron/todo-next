// app/page.tsx
'use client';

import UserSelector from '@/components/auth/UserSelector';
import AddTodo from '@/components/todo/AddTodo';
import TodoFilters from '@/components/todo/TodoFilters';
import TodoList from '@/components/todo/TodoList';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';

export default function Home() {
  const selectedUserId = useSelector(
    (state: RootState) => state.todo.selectedUserId
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Multi-User Todo App
          </h1>
          <p className="text-gray-600">
            A modern todo application demonstrating Next.js 16, RTK Query, and TypeScript
          </p>
        </div>

        <UserSelector />

        {selectedUserId && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                My Todos
              </h2>
              <AddTodo />
              <TodoFilters />
            </div>
            <TodoList />
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          Explore other sections of the application:
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/about"
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            About
          </Link>
          <Link
            href="/profile"
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}