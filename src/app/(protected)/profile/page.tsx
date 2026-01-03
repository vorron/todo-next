import { type Metadata } from 'next';

import { ProfilePage } from '@/screens/profile';
import { ROUTES, getRouteMetadata } from '@/shared/lib/router';

export const metadata: Metadata = getRouteMetadata(ROUTES.PROFILE);

export default function Page() {
  return <ProfilePage />;
}
