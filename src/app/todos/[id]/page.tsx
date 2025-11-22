import { use } from 'react';
import { TodoDetailPage } from '@/pages/todo-detail';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
    const { id } = use(params);
    return <TodoDetailPage todoId={id} />;
}