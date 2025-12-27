import { type Metadata } from 'next';

import { ProfilePage } from '@/screens/profile';
import { ROUTES } from '@/shared/config/routes';
import { getRouteMetadata } from '@/shared/lib/utils/router-utils';

export const metadata: Metadata = getRouteMetadata(ROUTES.PROFILE);

export default function Page() {
  return <ProfilePage />;
}
