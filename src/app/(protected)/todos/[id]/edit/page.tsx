import { TodoEditPage } from '@/screens/todo-edit';

type TodoEditParams = { id: string };

export default async function Page({ params }: { params: Promise<TodoEditParams> }) {
  const { id } = await params;

  return <TodoEditPage todoId={id} />;
}
