'use client';

import { useGetTodosQuery, useUpdateTodoMutation } from '@/lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface TodoDetailPageProps {
  params: {
    id: string;
  };
}

export default function TodoDetailPage({ params }: TodoDetailPageProps) {
  const { id } = params;
  const selectedUserId = useSelector(
    (state: RootState) => state.todo.selectedUserId
  );

  const { data: todos } = useGetTodosQuery(selectedUserId ?? undefined, {
    skip: !selectedUserId,
  });

  const [updateTodo] = useUpdateTodoMutation();

  const todo = todos?.find((t) => t.id === id);

  if (!selectedUserId) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Todo Details</h1>
          <p className="text-gray-600 mb-4">Please select a user to view todo details</p>
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

  if (!todo) {
    notFound();
  }

  const handleToggleComplete = async () => {
    try {
      await updateTodo({
        id: todo.id,
        completed: !todo.completed,
      }).unwrap();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              href="/"
              className="text-blue-500 hover:text-blue-600 mb-2 inline-block"
            >
              ← Back to all todos
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Todo Details</h1>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              todo.completed
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {todo.completed ? 'Completed' : 'Pending'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Todo Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Task</h2>
              <p className="text-lg text-gray-800">{todo.text}</p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleToggleComplete}
                className={`px-4 py-2 rounded-lg font-medium ${
                  todo.completed
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {todo.completed ? 'Mark as Pending' : 'Mark as Completed'}
              </button>
              <Link
                href="/"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Edit Todo
              </Link>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Created</h3>
              <p className="text-sm text-gray-600">
                {new Date(todo.createdAt).toLocaleDateString()} at{' '}
                {new Date(todo.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Last Updated</h3>
              <p className="text-sm text-gray-600">
                {new Date(todo.updatedAt).toLocaleDateString()} at{' '}
                {new Date(todo.updatedAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Todo ID</h3>
              <p className="text-sm font-mono text-gray-600">{todo.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}