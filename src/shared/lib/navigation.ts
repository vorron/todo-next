import { useRouter } from 'next/navigation';

import { ROUTES } from './router';

export function useNavigation() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const navigateToTodos = () => navigateTo(ROUTES.TODOS);
  const navigateToTodoDetail = (id: string) =>
    ROUTES.TODO_DETAIL && navigateTo(ROUTES.TODO_DETAIL(id));
  const navigateToTodoEdit = (id: string) => ROUTES.TODO_EDIT && navigateTo(ROUTES.TODO_EDIT(id));

  return {
    navigateTo,
    navigateToTodos,
    navigateToTodoDetail,
    navigateToTodoEdit,
  };
}
