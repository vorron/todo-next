import { TodoDetailPage } from '@/screens/todo-detail';

type TodoDetailParams = { id: string };

export default async function Page({ params }: { params: Promise<TodoDetailParams> }) {
  const { id } = await params;

  return <TodoDetailPage todoId={id} />;
}
