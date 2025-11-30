import { TodoDetailPage } from '@/screens/todo-detail';

interface PageProps {
    params: { id: string };
}

export default function Page({ params }: PageProps) {
    return <TodoDetailPage todoId={params.id} />;
}
