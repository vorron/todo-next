// components/todo/TodoList.tsx
'use client';

import { useGetTodosQuery } from '@/lib/api';
import TodoItem from './TodoItem';
import { useTodo } from '@/lib/hooks/useTodo';

export default function TodoList() {
  const { selectedUserId, filter } = useTodo()

  const {
    data: todos = [],
    isLoading,
    error,
  } = useGetTodosQuery(selectedUserId ?? undefined, {
    skip: !selectedUserId,
  });

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800">Error loading todos</p>
        <p className="text-sm text-red-600 mt-1">Please try again later</p>
      </div>
    );
  }

  if (!selectedUserId) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-2">Please select a user to view todos</p>
        <p className="text-sm text-gray-500">Choose a user from the selector above</p>
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {todos.length === 0 ? 'No todos yet. Add your first todo above!' : 'No todos match the current filter'}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 mb-2">
        Showing {filteredTodos.length} of {todos.length} todos
      </div>
      {
        filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))
      }
    </div >
  );
}