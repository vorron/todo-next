'use client';

import { use } from 'react';
import TodoDetail from '@/features/todos/TodoDetail';

interface TodoDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TodoDetailPage({ params }: TodoDetailPageProps) {
  const { id } = use(params);

  return id ? <TodoDetail todoId={id} /> : null
}