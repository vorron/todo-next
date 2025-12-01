import AboutPage from '@/screens/about/page';
import { ROUTES } from '@/shared/config/routes';
import { getRouteMetadata } from '@/shared/lib/utils/router-utils';
import { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata(ROUTES.ABOUT)

export default function Page() {
    return <AboutPage />;
}
