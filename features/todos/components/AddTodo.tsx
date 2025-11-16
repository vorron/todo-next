// components/todo/AddTodo.tsx
'use client';

import { useState } from 'react';
import { useAddTodoMutation } from '@/lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

export default function AddTodo() {
  const [text, setText] = useState('');
  const [addTodo, { isLoading }] = useAddTodoMutation();
  const selectedUserId = useSelector(
    (state: RootState) => state.todo.selectedUserId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedUserId) return;

    try {
      await addTodo({ 
        text: text.trim(), 
        userId: selectedUserId 
      }).unwrap();
      setText('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  if (!selectedUserId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-800">
          Please select a user to add todos
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
}