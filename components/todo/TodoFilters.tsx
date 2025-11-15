// components/todo/TodoFilters.tsx
'use client';

import { FilterType } from '@/types';
import { setFilter } from '@/lib/slices/todoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function TodoFilters() {
  const dispatch = useDispatch();
  const currentFilter = useSelector((state: RootState) => state.todo.filter);

  return (
    <div className="flex gap-2 mb-4">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => dispatch(setFilter(filter.key))}
          className={`px-3 py-1 rounded-lg border ${
            currentFilter === filter.key
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}