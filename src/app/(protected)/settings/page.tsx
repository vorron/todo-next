import { SettingsPage } from '@/screens/settings';
import { ROUTES } from '@/shared/config/routes';
import { getRouteMetadata } from '@/shared/lib/utils/router-utils';

import type { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata(ROUTES.SETTINGS);

export default function Page() {
  return <SettingsPage />;
}
