import { TodosPage } from '@/screens/todos/page';
import { ROUTES } from '@/shared/config/routes';
import { getRouteMetadata } from '@/shared/lib/utils/router-utils';
import { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata(ROUTES.TODOS);

export default function Page() {
  return <TodosPage />;
}
