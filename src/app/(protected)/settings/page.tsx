import { SettingsPage } from '@/screens/settings';
import { ROUTES, getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata(ROUTES.SETTINGS);

export default function Page() {
  return <SettingsPage />;
}
