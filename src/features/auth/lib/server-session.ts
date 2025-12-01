import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from './session-config';

export async function hasValidSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value === 'true';
}