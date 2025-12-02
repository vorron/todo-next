import type { Session } from '../model/types';
import {
  loadClientSession,
  saveClientSession,
  clearClientSession,
  isClientSessionValid,
  createMockSession,
} from './session-service.client';

export const sessionStorage = {
  save(session: Session): void {
    saveClientSession(session);
  },
  get(): Session | null {
    return loadClientSession();
  },
  clear(): void {
    clearClientSession();
  },
  isValid(): boolean {
    return isClientSessionValid();
  },
};

export { createMockSession };
