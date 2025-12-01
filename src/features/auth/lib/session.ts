import type { Session } from '../model/types';
import { sessionSchema } from '../model/auth-schema';
import { SESSION_STORAGE_KEY, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from './session-config';

function updateSessionCookie(hasSession: boolean): void {
  if (typeof document === 'undefined') return;

  if (hasSession) {
    document.cookie = `${SESSION_COOKIE_NAME}=true; path=/; max-age=${SESSION_COOKIE_MAX_AGE}`;
  } else {
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
  }
}

export const sessionStorage = {
  save(session: Session): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    updateSessionCookie(true);
  },

  get(): Session | null {
    if (typeof window === 'undefined') return null;

    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);
      const result = sessionSchema.safeParse(parsed);

      if (!result.success) {
        this.clear();
        return null;
      }

      const session = result.data;

      if (new Date(session.expiresAt) < new Date()) {
        this.clear();
        return null;
      }

      return session;
    } catch {
      this.clear();
      return null;
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_STORAGE_KEY);
    updateSessionCookie(false);
  },

  isValid(): boolean {
    return this.get() !== null;
  },
};

export function createMockSession(userId: string, username: string, name: string): Session {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  return {
    userId,
    username,
    name,
    expiresAt: expiresAt.toISOString(),
  };
}