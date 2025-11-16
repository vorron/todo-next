import AddTodo from '@/features/todos/components/AddTodo';
import TodoFilters from '@/features/todos/components/TodoFilters';
import TodoList from '@/features/todos/components/TodoList';

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