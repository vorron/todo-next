import { redirect } from 'next/navigation';

import { ROUTES } from '@/shared/lib/router';

function HomePage() {
  redirect(ROUTES.TODOS);
}

export default HomePage;
