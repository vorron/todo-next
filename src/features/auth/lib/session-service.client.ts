'use client';

import { SESSION_STORAGE_KEY, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from './session-config';
import { sessionSchema } from '../model/auth-schema';

import type { Session } from '../model/types';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function updateSessionCookie(hasSession: boolean): void {
  if (!isBrowser()) return;

  if (hasSession) {
    document.cookie = `${SESSION_COOKIE_NAME}=true; path=/; max-age=${SESSION_COOKIE_MAX_AGE}`;
  } else {
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
  }
}

function parseSession(raw: unknown): Session | null {
  const result = sessionSchema.safeParse(raw);
  if (!result.success) {
    return null;
  }

  const session = result.data;
  if (new Date(session.expiresAt) < new Date()) {
    return null;
  }

  return session;
}

export function loadClientSession(): Session | null {
  if (!isBrowser()) return null;

  const data = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!data) return null;

  try {
    const parsed = JSON.parse(data) as unknown;
    const session = parseSession(parsed);

    if (!session) {
      clearClientSession();
      return null;
    }

    return session;
  } catch {
    clearClientSession();
    return null;
  }
}

export function saveClientSession(session: Session): void {
  if (!isBrowser()) return;

  const validSession = parseSession(session);
  if (!validSession) {
    // В девелопменте сразу подсветим некорректную/просроченную сессию
    throw new Error('Attempted to save invalid or expired Session');
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(validSession));
  updateSessionCookie(true);
}

export function clearClientSession(): void {
  if (!isBrowser()) return;

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  updateSessionCookie(false);
}

export function isClientSessionValid(): boolean {
  return loadClientSession() !== null;
}

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
