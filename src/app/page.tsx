import { redirect } from 'next/navigation';

import { ROUTES } from '@/shared/config/routes';

function HomePage() {
  redirect(ROUTES.TODOS);
}

export default HomePage;
