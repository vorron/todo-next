import { ROUTES } from '@/shared/config/routes';
import { useRouter } from 'next/navigation';

export function useNavigation() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const navigateToTodos = () => navigateTo(ROUTES.TODOS);
  const navigateToTodoDetail = (id: string) => navigateTo(ROUTES.TODO_DETAIL(id));
  const navigateToTodoEdit = (id: string) => navigateTo(ROUTES.TODO_EDIT(id));

  return {
    navigateTo,
    navigateToTodos,
    navigateToTodoDetail,
    navigateToTodoEdit,
  };
}
