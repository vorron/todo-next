'use client';

import { useDeleteTodoMutation, useUpdateTodoMutation } from '@/lib/api';
import { Todo } from '@/types';
import { useRouter } from 'next/navigation';

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

  const router = useRouter()

  const handleToggle = async () => {
    try {
      await updateTodo({
        id: todo.id,
        completed: !todo.completed,
      }).unwrap();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id).unwrap();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleDetails = () => {
    router.push(`/todos/${todo.id}`);
  }

  const isLoading = isUpdating || isDeleting;

  return (
    <div
      className={`flex items-center gap-3 p-3 border rounded-lg ${isLoading ? 'opacity-50' : ''
        } ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isLoading}
        className="h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
      />

      <span
        className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}
      >
        {todo.text}
      </span>

      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="px-2 py-1 text-red-500 hover:text-red-700 disabled:text-gray-400"
      >
        Delete
      </button>

      <button
        onClick={handleDetails}
        className="px-2 py-1 text-red-500 hover:text-red-700 disabled:text-gray-400"
      >
        Details
      </button>
    </div>
  );
}