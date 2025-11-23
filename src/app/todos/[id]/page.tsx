import { TodoDetailPage } from '@/screens/todo-detail';

interface PageProps {
    params: { id: string };
}

export default function Page({ params }: PageProps) {
    return <TodoDetailPage todoId={params.id} />;
}

// import { use } from 'react';

// export default function Page({ params }: PageProps) {
//     const { id } = use(params);
//     return <TodoDetailPage todoId={id} />;
// }