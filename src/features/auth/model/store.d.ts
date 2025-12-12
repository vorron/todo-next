import type { AuthState } from './types';

declare module '@/shared/store/types' {
  interface AppState {
    auth: AuthState;
  }
}
