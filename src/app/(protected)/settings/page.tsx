import SettingsPage from '@/screens/settings/page';
import { ROUTES } from '@/shared/config/routes';
import { getRouteMetadata } from '@/shared/lib/utils/router-utils';
import { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata(ROUTES.SETTINGS);

export default function Page() {
  return <SettingsPage />;
}
