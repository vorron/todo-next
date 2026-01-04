import { WorkspacesPage } from '@/screens/workspaces';
import { ROUTES, getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata(ROUTES.WORKSPACES);

export default function Page() {
  return <WorkspacesPage />;
}
