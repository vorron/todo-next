// app/todos/page.tsx
import AddTodo from '@/components/todo/AddTodo';
import TodoFilters from '@/components/todo/TodoFilters';
import TodoList from '@/components/todo/TodoList';
import React from 'react';

const TodosPage = () => {
    return (
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
    );
};

export default TodosPage;