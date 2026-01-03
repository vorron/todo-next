import { AboutPage } from '@/screens/about';
import { ROUTES, getRouteMetadata } from '@/shared/lib/router';

import type { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata(ROUTES.ABOUT);

export default function Page() {
  return <AboutPage />;
}
