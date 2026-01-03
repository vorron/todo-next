import { TodosPage } from '@/screens/todos';
import { ROUTES, getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata(ROUTES.TODOS);

export default function Page() {
  return <TodosPage />;
}
